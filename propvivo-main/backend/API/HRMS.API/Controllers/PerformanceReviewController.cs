using HRMS.Core.Postgres.Repositories;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PerformanceReviewController : ControllerBase
    {
        private readonly IPostgresRepository<PerformanceReview> _repository;

        public PerformanceReviewController(IPostgresRepository<PerformanceReview> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var (data, count) = await _repository.GetItemsWithCountAsync<DateTime>(
                _ => true, new HRMS.Core.Postgres.Common.Request(), a => a.ReviewDate);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] PerformanceReview record)
        {
            record.Id = Guid.NewGuid().ToString();
            await _repository.AddItemAsync(record);
            return Ok(record);
        }
    }
}
