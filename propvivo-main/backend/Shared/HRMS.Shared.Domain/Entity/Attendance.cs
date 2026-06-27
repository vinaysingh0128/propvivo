using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class Attendance : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public DateTime ClockInTime { get; set; }
        public DateTime? ClockOutTime { get; set; }
        public string Status { get; set; } = "Present";
    }
}
