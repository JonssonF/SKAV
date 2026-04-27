using Microsoft.AspNetCore.Mvc.Testing;

namespace SKAV.Tests.Smoke
{
    public class SmokeTests : IClassFixture<WebApplicationFactory<SKAV.Api.Program>>
    {
        private readonly HttpClient _client;

        public SmokeTests(WebApplicationFactory<SKAV.Api.Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Theory]
        [InlineData("/api/gigs")]
        [InlineData("/api/albums")]
        [InlineData("/api/members")]

        public async Task Endpoints_ShouldBeAlive(string url)
        {
            var response = await _client.GetAsync(url);

            Assert.True(response.IsSuccessStatusCode);
        }
    }
}
