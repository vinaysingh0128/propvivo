using HRMS.Core.Postgres.Repositories;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AttendanceController : ControllerBase
    {
        private readonly IPostgresRepository<Attendance> _attendanceRepository;

        public AttendanceController(IPostgresRepository<Attendance> attendanceRepository)
        {
            _attendanceRepository = attendanceRepository;
        }

        [HttpPost("clock-in")]
        public async Task<IActionResult> ClockIn()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var attendance = new Attendance
            {
                Id = Guid.NewGuid().ToString(),
                UserId = userId,
                ClockInTime = DateTime.UtcNow,
                Status = "Present"
            };

            await _attendanceRepository.AddItemAsync(attendance);
            return Ok(attendance);
        }

        [HttpPost("clock-out")]
        public async Task<IActionResult> ClockOut([FromBody] ClockOutRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var attendance = await _attendanceRepository.GetItemAsync(a => a.Id == request.AttendanceId && a.UserId == userId);
            if (attendance == null) return NotFound("Attendance record not found.");

            attendance.ClockOutTime = DateTime.UtcNow;
            await _attendanceRepository.UpdateItemAsync(attendance.Id, attendance);
            
            return Ok(attendance);
        }

        [HttpGet("my-attendance")]
        public async Task<IActionResult> GetMyAttendance()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var (data, count) = await _attendanceRepository.GetItemsWithCountAsync<DateTime>(
                a => a.UserId == userId,
                new HRMS.Core.Postgres.Common.Request(),
                a => a.ClockInTime
            );

            return Ok(data);
        }
    }

    public class ClockOutRequest
    {
        public string AttendanceId { get; set; } = string.Empty;
    }
}
