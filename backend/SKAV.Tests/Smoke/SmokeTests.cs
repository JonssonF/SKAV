namespace SKAV.Tests.Smoke
{
    public class SmokeTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public SmokeTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        [Theory]
        [InlineData("/api/albums")]
        [InlineData("/api/gigs")]
        [InlineData("/api/members")]
        [InlineData("/api/songs")]
        [InlineData("/api/products")]
        //With Auth
        [InlineData("/api/booking-recipients")]
        [InlineData("/api/subscribers")]
        [InlineData("/api/users")]
        [InlineData("/api/product-orders")]




        public async Task Endpoints_ShouldBeAlive(string url)
        {
            // Collection to test controllers with authorization
            var needAuth = new List<string>
            { "/api/subscribers",
              "/api/booking-recipients",
              "/api/product-orders",
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
