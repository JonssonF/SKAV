using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace SKAV.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GigController : ControllerBase
    {

        [HttpPost]
        public IActionResult CreateGig()
        {
            return Ok("Gig created successfully.");

        }
    }
}
