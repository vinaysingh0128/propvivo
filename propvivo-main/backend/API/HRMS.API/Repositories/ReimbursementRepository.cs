using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class ReimbursementRepository : PostgresDbRepository<Reimbursement>
    {
        public ReimbursementRepository(PostgresDbContext context, ILogger<ReimbursementRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "Reimbursements";
        public override string GenerateId(Reimbursement entity) => Guid.NewGuid().ToString();
    }
}
