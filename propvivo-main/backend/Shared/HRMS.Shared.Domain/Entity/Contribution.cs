using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class Contribution : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string ContributionType { get; set; } = string.Empty; // EPF, Health Insurance
        public decimal EmployeeAmount { get; set; }
        public decimal EmployerAmount { get; set; }
        public string Month { get; set; } = string.Empty;
    }
}
