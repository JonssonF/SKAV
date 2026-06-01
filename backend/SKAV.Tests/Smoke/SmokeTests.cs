using SKAV.Domain.Entities;
using System.Text.Json;

namespace SKAV.Tests.Smoke
{
    public class SmokeTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;

        public SmokeTests(CustomWebApplicationFactory factory)
        {
            _client = factory.CreateClient();
        }

        public static IEnumerable<object[]> GetEndpointsFromSwagger()
        {
            var factory = new CustomWebApplicationFactory();
            var client = factory.CreateClient();

            var response = client.GetAsync("/swagger/v1/swagger.json").Result;
            var json = response.Content.ReadAsStringAsync().Result;

            var doc = JsonDocument.Parse(json);
            var paths = doc.RootElement.GetProperty("paths");

            foreach (var path in paths.EnumerateObject())
            {
                if (path.Name.Contains("{")) continue;
                if (!path.Value.TryGetProperty("get", out _)) continue;

                yield return new object[] { path.Name };
            }
        }

        [Theory]
        [MemberData(nameof(GetEndpointsFromSwagger))]
        public async Task Get_Endpoints_ShouldRespond(string url)
        {
            var needAuth = new List<string>
            {
                "/api/subscribers",
                "/api/booking-recipients",
                "/api/product-orders",
                "/api/users",
                "/api/product-order-recipients",
                "/api/booking-requests",
                "/api/products/categories"
            };

            if (needAuth.Contains(url))
            {
                var unauth = await _client.GetAsync(url);
                Assert.Equal(System.Net.HttpStatusCode.Unauthorized, unauth.StatusCode);
                return;
            }

            var response = await _client.GetAsync(url);
            Assert.True(response.IsSuccessStatusCode);
        }
    }
}