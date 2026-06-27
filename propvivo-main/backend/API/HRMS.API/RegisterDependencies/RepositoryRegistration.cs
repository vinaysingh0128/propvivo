using HRMS.Core.Postgres.Interfaces;
using Microsoft.Extensions.DependencyInjection.Extensions;
using TodoFeature.Infrastructure;

namespace HRMS.API.RegisterDependencies
{
    public static class RepositoryRegistration
    {
        public static IServiceCollection AddModulesDependencyInjection(this IServiceCollection services, IConfiguration configuration)
        {
            // Register entity configurators so EF Core knows about all tables in the DbContext
            services.TryAddEnumerable(ServiceDescriptor.Scoped<IPostgresEntityConfigurator, HrmsEntityConfigurator>());

            services.AddTodoDependency(configuration);
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.User>, HRMS.API.Repositories.UserRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.Attendance>, HRMS.API.Repositories.AttendanceRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.LeaveRequest>, HRMS.API.Repositories.LeaveRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.PayrollRecord>, HRMS.API.Repositories.PayrollRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.Reimbursement>, HRMS.API.Repositories.ReimbursementRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.PerformanceReview>, HRMS.API.Repositories.PerformanceReviewRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.Contribution>, HRMS.API.Repositories.ContributionRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.TrainingSession>, HRMS.API.Repositories.TrainingSessionRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.JobPosting>, HRMS.API.Repositories.JobPostingRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.Recognition>, HRMS.API.Repositories.RecognitionRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.Announcement>, HRMS.API.Repositories.AnnouncementRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.Team>, HRMS.API.Repositories.TeamRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.AnalyticsReport>, HRMS.API.Repositories.AnalyticsReportRepository>();
            services.AddScoped<HRMS.Core.Postgres.Repositories.IPostgresRepository<HRMS.Shared.Domain.Entity.CopilotQuery>, HRMS.API.Repositories.CopilotQueryRepository>();
            return services;
        }
    }
}
