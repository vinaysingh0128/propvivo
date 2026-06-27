using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class TrainingSessionRepository : PostgresDbRepository<TrainingSession>
    {
        public TrainingSessionRepository(PostgresDbContext context, ILogger<TrainingSessionRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "TrainingSessions";
        public override string GenerateId(TrainingSession entity) => Guid.NewGuid().ToString();
    }
}
