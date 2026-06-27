using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class AnalyticsReportRepository : PostgresDbRepository<AnalyticsReport>
    {
        public AnalyticsReportRepository(PostgresDbContext context, ILogger<AnalyticsReportRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "AnalyticsReports";
        public override string GenerateId(AnalyticsReport entity) => Guid.NewGuid().ToString();
    }
}
