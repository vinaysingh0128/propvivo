using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class TeamRepository : PostgresDbRepository<Team>
    {
        public TeamRepository(PostgresDbContext context, ILogger<TeamRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "Teams";
        public override string GenerateId(Team entity) => Guid.NewGuid().ToString();
    }
}
