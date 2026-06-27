using HRMS.Core.Postgres.Common;
using System;

namespace HRMS.Shared.Domain.Entity
{
    public class Team : BaseEntity
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string ManagerId { get; set; } = string.Empty;
    }
}
