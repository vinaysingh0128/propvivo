using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class PerformanceReview : BaseEntity
    {
        public string RevieweeId { get; set; } = string.Empty;
        public string ReviewerId { get; set; } = string.Empty;
        public string ReviewPeriod { get; set; } = string.Empty;
        public int Score { get; set; }
        public string Feedback { get; set; } = string.Empty;
        public DateTime ReviewDate { get; set; }
    }
}
