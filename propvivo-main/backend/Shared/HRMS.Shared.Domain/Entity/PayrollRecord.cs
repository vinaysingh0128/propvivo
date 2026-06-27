using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class PayrollRecord : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string PayPeriod { get; set; } = string.Empty;
        public decimal BaseSalary { get; set; }
        public decimal Deductions { get; set; }
        public decimal NetPay { get; set; }
        public DateTime PaymentDate { get; set; }
        public string Status { get; set; } = "Processed";
    }
}
