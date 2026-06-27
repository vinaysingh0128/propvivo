using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class CopilotQueryRepository : PostgresDbRepository<CopilotQuery>
    {
        public CopilotQueryRepository(PostgresDbContext context, ILogger<CopilotQueryRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "CopilotQueries";
        public override string GenerateId(CopilotQuery entity) => Guid.NewGuid().ToString();
    }
}
