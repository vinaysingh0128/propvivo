using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class PerformanceReviewRepository : PostgresDbRepository<PerformanceReview>
    {
        public PerformanceReviewRepository(PostgresDbContext context, ILogger<PerformanceReviewRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "PerformanceReviews";
        public override string GenerateId(PerformanceReview entity) => Guid.NewGuid().ToString();
    }
}
