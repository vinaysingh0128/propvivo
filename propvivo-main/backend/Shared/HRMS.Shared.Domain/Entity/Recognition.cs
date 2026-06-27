using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class Recognition : BaseEntity
    {
        public string ReceiverId { get; set; } = string.Empty;
        public string SenderId { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string BadgeType { get; set; } = string.Empty;
        public DateTime DateGiven { get; set; }
    }
}
