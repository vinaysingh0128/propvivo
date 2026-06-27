using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class RecognitionRepository : PostgresDbRepository<Recognition>
    {
        public RecognitionRepository(PostgresDbContext context, ILogger<RecognitionRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "Recognitions";
        public override string GenerateId(Recognition entity) => Guid.NewGuid().ToString();
    }
}
