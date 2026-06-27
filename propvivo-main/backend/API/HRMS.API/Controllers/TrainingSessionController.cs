using HRMS.Core.Postgres.Repositories;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TrainingSessionController : ControllerBase
    {
        private readonly IPostgresRepository<TrainingSession> _repository;

        public TrainingSessionController(IPostgresRepository<TrainingSession> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var (data, count) = await _repository.GetItemsWithCountAsync<DateTime>(
                _ => true, new HRMS.Core.Postgres.Common.Request(), a => a.ScheduledDate);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TrainingSession record)
        {
            record.Id = Guid.NewGuid().ToString();
            await _repository.AddItemAsync(record);
            return Ok(record);
        }
    }
}
