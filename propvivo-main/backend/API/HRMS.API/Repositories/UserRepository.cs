using HRMS.Core.Postgres.Data;
using HRMS.Core.Postgres.Repositories;
using HRMS.Core.Telemetry;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace HRMS.API.Repositories
{
    public class UserRepository : PostgresDbRepository<User>
    {
        public UserRepository(
            PostgresDbContext context, 
            ILogger<UserRepository> logger, 
            ITelemetryService telemetryService, 
            IHttpContextAccessor httpContextAccessor) 
            : base(context, logger, telemetryService, httpContextAccessor)
        {
        }

        public override string TableName => "Users";

        public override string GenerateId(User entity)
        {
            return Guid.NewGuid().ToString();
        }
    }
}
