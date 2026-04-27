using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using System.Net;
using SKAV.Api;
using SKAV.Application.DTOs.Gigs;
using System.Net.Http.Json;

namespace SKAV.Tests.Api
{
    public class GigsControllerTests : IClassFixture<WebApplicationFactory<SKAV.Api.Program>>
    {
        private readonly HttpClient _client;

        public GigsControllerTests(WebApplicationFactory<SKAV.Api.Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetAll_ShouldReturn200()
        {
            var response = await _client.GetAsync("/api/gigs");

            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetById_ShouldReturn200_WhenFound()
        {
            // First, create a gig to ensure there is one to retrieve
            var createResponse = await _client.PostAsJsonAsync("/api/gigs", new
            {
                Title = "Test Gig",
                Description = "Test Description",
                Location = "Test Location",
                Date = DateTimeOffset.UtcNow.AddDays(1),
                Price = 100
            });
            createResponse.EnsureSuccessStatusCode();
            var createdGig = await createResponse.Content.ReadFromJsonAsync<CreateGigResponseDto>();
            // Now, retrieve the created gig by ID
            var response = await _client.GetAsync($"/api/gigs/{createdGig.Id}");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task GetById_ShouldReturn404_WhenNotFound()
        {
            var response = await _client.GetAsync("/api/gigs/999");

            Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        }

        [Fact]
        public async Task UpdateGig_ShouldReturn200_WhenSucceded()
        {
            // First, create a gig to ensure there is one to update
            var createResponse = await _client.PostAsJsonAsync("/api/gigs", new
            {
                Title = "Test Gig",
                Description = "Test Description",
                Location = "Test Location",
                Date = DateTimeOffset.UtcNow.AddDays(1),
                Price = 100
            });
            createResponse.EnsureSuccessStatusCode();
            var createdGig = await createResponse.Content.ReadFromJsonAsync<CreateGigResponseDto>();
            // Now, update the created gig
            var updateResponse = await _client.PutAsJsonAsync($"/api/gigs/{createdGig.Id}", new
            {
                Title = "Updated Test Gig",
                Description = "Updated Test Description",
                Location = "Updated Test Location",
                Date = DateTimeOffset.UtcNow.AddDays(2),
                Price = 150
            });
            Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        }
    }
}
