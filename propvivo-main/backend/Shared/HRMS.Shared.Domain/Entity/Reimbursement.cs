using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class Reimbursement : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string ExpenseType { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public DateTime DateIncurred { get; set; }
        public string Status { get; set; } = "Pending";
        public string Description { get; set; } = string.Empty;
    }
}
