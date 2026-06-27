using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class CopilotQuery : BaseEntity
    {
        public string UserId { get; set; } = string.Empty;
        public string Prompt { get; set; } = string.Empty;
        public string Response { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
    }
}
