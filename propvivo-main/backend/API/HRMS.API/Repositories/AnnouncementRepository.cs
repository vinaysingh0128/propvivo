using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;

namespace HRMS.API.Repositories
{
    public class AnnouncementRepository : PostgresDbRepository<Announcement>
    {
        public AnnouncementRepository(PostgresDbContext context, ILogger<AnnouncementRepository> logger, ITelemetryService telemetryService, IHttpContextAccessor httpContextAccessor) : base(context, logger, telemetryService, httpContextAccessor) {}
        public override string TableName => "Announcements";
        public override string GenerateId(Announcement entity) => Guid.NewGuid().ToString();
    }
}
