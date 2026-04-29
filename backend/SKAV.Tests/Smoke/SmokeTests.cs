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
        [InlineData("/api/songs")]
        [InlineData("/api/instruments")]
        [InlineData("/api/memberinstruments")]
        [InlineData("/api/subscribers")]
        [InlineData("/api/users")]



        public async Task Endpoints_ShouldBeAlive(string url)
        {
            // Collection to test controllers with authorization
            var needAuth = new List<string> 
            { "/api/subscribers",
              "/api/users"
            };

            if (needAuth.Contains(url))
            {
                
                var auth = await _client.GetAsync(url);
                Assert.Equal(System.Net.HttpStatusCode.Unauthorized, auth.StatusCode);
                return;
            }

            var response = await _client.GetAsync(url);

            Assert.True(response.IsSuccessStatusCode);
        }
    }
}
