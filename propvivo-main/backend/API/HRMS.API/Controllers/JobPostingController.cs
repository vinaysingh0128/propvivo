using HRMS.Core.Postgres.Repositories;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class JobPostingController : ControllerBase
    {
        private readonly IPostgresRepository<JobPosting> _repository;

        public JobPostingController(IPostgresRepository<JobPosting> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var (data, count) = await _repository.GetItemsWithCountAsync<DateTime>(
                _ => true, new HRMS.Core.Postgres.Common.Request(), a => a.DatePosted);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] JobPosting record)
        {
            record.Id = Guid.NewGuid().ToString();
            await _repository.AddItemAsync(record);
            return Ok(record);
        }
    }
}
