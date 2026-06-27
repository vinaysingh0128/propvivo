using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class PayrollRepository : PostgresDbRepository<PayrollRecord>
    {
        public PayrollRepository(PostgresDbContext context, ILogger<PayrollRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "PayrollRecords";
        public override string GenerateId(PayrollRecord entity) => Guid.NewGuid().ToString();
    }
}
