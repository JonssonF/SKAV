using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SKAV.Application.DTOs.Gigs;
using System.Net;
using System.Net.Http.Json;
using System.Text.Json;

namespace SKAV.Tests.Api
{
    public class GigsControllerTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public GigsControllerTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
            _factory = factory;
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
            await AuthenticateAsync();

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
            var response = await _client.GetAsync($"/api/gigs/{createdGig?.Id}");
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
            await AuthenticateAsync();

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
            var updateResponse = await _client.PutAsJsonAsync($"/api/gigs/{createdGig?.Id}", new
            {
                Title = "Updated Test Gig",
                Description = "Updated Test Description",
                Location = "Updated Test Location",
                Date = DateTimeOffset.UtcNow.AddDays(2),
                Price = 150
            });
            Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);
        }

        private async Task AuthenticateAsync()
        {
            var password = _factory.Services
                .GetRequiredService<IConfiguration>()["Seed:AdminPassword"];

            var response = await _client.PostAsJsonAsync("/api/auth/login", new
            {
                Email = "admin@skav.se",
                Password = password
            });

            var body = await response.Content.ReadAsStringAsync();
            Assert.True(response.IsSuccessStatusCode, $"Login failed: {response.StatusCode} - {body}");

            var result = JsonSerializer.Deserialize<JsonElement>(body);
            var token = result.GetProperty("token").GetString();

            _client.DefaultRequestHeaders.Authorization =
                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
        }
    }
}
