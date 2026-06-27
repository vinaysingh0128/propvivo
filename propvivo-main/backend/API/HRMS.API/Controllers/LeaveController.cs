using System.Security.Claims;
using HRMS.Core.Postgres.Repositories;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class LeaveController : ControllerBase
    {
        private readonly IPostgresRepository<LeaveRequest> _repository;

        public LeaveController(IPostgresRepository<LeaveRequest> repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();
            
            var userRole = User.FindFirst(ClaimTypes.Role)?.Value;

            var (data, count) = await _repository.GetItemsWithCountAsync<DateTime>(
                l => userRole == "Admin" || userRole == "Manager" || l.UserId == userId, 
                new HRMS.Core.Postgres.Common.Request(), 
                a => a.StartDate);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] LeaveRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            request.Id = Guid.NewGuid().ToString();
            request.UserId = userId;
            
            if (string.IsNullOrEmpty(request.Status)) 
            {
                request.Status = "Pending";
            }

            await _repository.AddItemAsync(request);
            return Ok(request);
        }
    }
}
