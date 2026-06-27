using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class TrainingSession : BaseEntity
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Instructor { get; set; } = string.Empty;
        public DateTime ScheduledDate { get; set; }
        public int Capacity { get; set; }
    }
}
