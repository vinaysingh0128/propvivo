using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class ContributionRepository : PostgresDbRepository<Contribution>
    {
        public ContributionRepository(PostgresDbContext context, ILogger<ContributionRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "Contributions";
        public override string GenerateId(Contribution entity) => Guid.NewGuid().ToString();
    }
}
