using Moq;
using SKAV.Application.Interfaces;
using SKAV.Application.Interfaces.Repositories;
using SKAV.Application.Interfaces.UoW;
using SKAV.Application.Services;
using SKAV.Application.Validator.Gigs;

namespace SKAV.Tests.Services
{
    /// <summary>
    /// This is a helper class to create the GigService and its dependencies for testing purposes. 
    /// It returns a tuple containing the service and the mocked dependencies, 
    /// allowing tests to easily set up the necessary environment for testing the GigService methods.
    /// </summary>
    public static class TestHelper
    {
        public static (GigService service,
                       Mock<IGigRepository> repo,
                       Mock<IGigValidator> validator,
                       Mock<IUnitOfWork> uow,
                       Mock<ICurrentUserService> user) CreateGigService()
        {
            var repo = new Mock<IGigRepository>();
            var validator = new Mock<IGigValidator>();
            var uow = new Mock<IUnitOfWork>();
            var user = new Mock<ICurrentUserService>();
            var scope = new Mock<ITransactionScope>();

            // Set up the transaction scope to do nothing on commit and dispose
            // This is important to prevent actual transaction handling during tests, which can complicate test execution and lead to unintended side effects.
            uow.Setup(x => x.BeginTransactionScope()).Returns(scope.Object);

            // Set up the current user service to return a fixed user ID.
            // This allows tests to simulate an authenticated user without needing to set up actual authentication,
            // making it easier to test methods that depend on the current user's identity.
            user.Setup(x => x.UserId).Returns(1);

            var service = new GigService(repo.Object, validator.Object, uow.Object, user.Object);

            return (service, repo, validator, uow, user);
        }
    }
}
