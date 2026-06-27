using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class AnalyticsReport : BaseEntity
    {
        public string ReportName { get; set; } = string.Empty;
        public string ReportType { get; set; } = string.Empty;
        public string GeneratedBy { get; set; } = string.Empty;
        public DateTime GeneratedDate { get; set; }
        public string DataPayload { get; set; } = string.Empty; // JSON
    }
}
