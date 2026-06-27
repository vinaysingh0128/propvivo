using HRMS.Core.Postgres.Repositories;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReimbursementController : ControllerBase
    {
        private readonly IPostgresRepository<Reimbursement> _repository;

        public ReimbursementController(IPostgresRepository<Reimbursement> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var (data, count) = await _repository.GetItemsWithCountAsync<DateTime>(
                _ => true, new HRMS.Core.Postgres.Common.Request(), a => a.DateIncurred);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Reimbursement record)
        {
            record.Id = Guid.NewGuid().ToString();
            await _repository.AddItemAsync(record);
            return Ok(record);
        }
    }
}
