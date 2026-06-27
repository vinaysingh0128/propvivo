using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class AttendanceRepository : PostgresDbRepository<Attendance>
    {
        public AttendanceRepository(
            PostgresDbContext context, 
            ILogger<AttendanceRepository> logger, 
            ITelemetryService telemetryService, 
            IHttpContextAccessor httpContextAccessor) 
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public override string TableName => "Attendances";

        public override string GenerateId(Attendance entity)
        {
            return Guid.NewGuid().ToString();
        }
    }
}
