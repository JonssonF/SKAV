using Moq;
using SKAV.Application.DTOs.Gigs;
using SKAV.Application.Interfaces.UoW;
using SKAV.Domain.Entities;
using SKAV.Domain.Exceptions;

namespace SKAV.Tests.Services
{
    public class GigServiceTests
    {
        private readonly CreateGigRequestDto _requestDto = new ()
        {
            Title = "Test",
            Description = "Test",
            Location = "Test",
            Date = DateTimeOffset.UtcNow.AddDays(1),
            Price = 100
        };

        [Fact]
        public async Task Create_ShouldReturnId()
        {
            // Arrange
            var (service, repo, validator, _, _) = TestHelper.CreateGigService();

            validator.Setup(x => x.ValidateCreateAsync(
                    It.IsAny<CreateGigRequestDto>(),
                    It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            repo.Setup(x => x.CreateAsync(
                    It.IsAny<Gig>(),
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            // Act
            var result = await service.CreateAsync(_requestDto, default);

            // Assert
            Assert.Equal(1, result.Id);
        }

        [Fact]
        public async Task Create_ShouldThrow_WhenValidationFails()
        {
            // Arrange
            var (service, _, validator, _, _) = TestHelper.CreateGigService();

            validator.Setup(x => x.ValidateCreateAsync(
                    It.IsAny<CreateGigRequestDto>(),
                    It.IsAny<CancellationToken>()))
                .ThrowsAsync(new Exception("Validation failed"));

            // Act & Assert
            await Assert.ThrowsAsync<Exception>(() =>
                service.CreateAsync(_requestDto, default));
        }

        [Fact]
        public async Task GetById_ShouldThrow_WhenNotFound()
        {
            // Arrange
            var (service, repo, _, _, _) = TestHelper.CreateGigService();

            repo.Setup(x => x.GetByIdAsync(1, It.IsAny<CancellationToken>()))
                .ReturnsAsync((Gig?)null);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() =>
                service.GetByIdAsync(1, default));
        }

        [Fact]
        public async Task Create_ShouldCallValidator_Once()
        {
            var (service, repo, validator, _, _) = TestHelper.CreateGigService();

            validator.Setup(x => x.ValidateCreateAsync(It.IsAny<CreateGigRequestDto>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            repo.Setup(x => x.CreateAsync(It.IsAny<Gig>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            await service.CreateAsync(_requestDto, default);

            validator.Verify(x => x.ValidateCreateAsync(_requestDto, It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task Create_ShouldCallRepo_Once()
        {
            var (service, repo, validator, _, _) = TestHelper.CreateGigService();

            validator.Setup(x => x.ValidateCreateAsync(It.IsAny<CreateGigRequestDto>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            repo.Setup(x => x.CreateAsync(It.IsAny<Gig>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            await service.CreateAsync(_requestDto, default);

            repo.Verify(x => x.CreateAsync(It.IsAny<Gig>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task Create_ShouldCommitTransaction()
        {
            var (service, repo, validator, uow, _) = TestHelper.CreateGigService();
            var scope = new Mock<ITransactionScope>();

            uow.Setup(x => x.BeginTransactionScope()).Returns(scope.Object);

            validator.Setup(x => x.ValidateCreateAsync(It.IsAny<CreateGigRequestDto>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            repo.Setup(x => x.CreateAsync(It.IsAny<Gig>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            await service.CreateAsync(_requestDto, default);

            scope.Verify(x => x.CommitTransactionScopeAsync(It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task Create_ShouldMapCorrectData()
        {
            var (service, repo, validator, _, _) = TestHelper.CreateGigService();

            validator.Setup(x => x.ValidateCreateAsync(It.IsAny<CreateGigRequestDto>(), It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);

            repo.Setup(x => x.CreateAsync(It.IsAny<Gig>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(1);

            await service.CreateAsync(_requestDto, default);

            repo.Verify(x => x.CreateAsync(
                It.Is<Gig>(g => g.Title == _requestDto.Title &&
                                g.Description == _requestDto.Description &&
                                g.Location == _requestDto.Location),
                It.IsAny<CancellationToken>()),
                Times.Once);
        }

        [Fact]
        public async Task Create_ShouldNotCallRepo_WhenValidationFails()
        {
            var (service, repo, validator, _, _) = TestHelper.CreateGigService();

            validator.Setup(x => x.ValidateCreateAsync(It.IsAny<CreateGigRequestDto>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new Exception());

            await Assert.ThrowsAsync<Exception>(() =>
                service.CreateAsync(_requestDto, default));

            repo.Verify(x => x.CreateAsync(It.IsAny<Gig>(), It.IsAny<CancellationToken>()), Times.Never);
        }
    }
}
