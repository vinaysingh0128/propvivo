using HRMS.Core.Postgres.Interfaces;
using HRMS.Shared.Domain.Entity;
using Microsoft.EntityFrameworkCore;

namespace HRMS.API.RegisterDependencies
{
    /// <summary>
    /// Registers all HRMS domain entities with the EF Core DbContext model.
    /// Without this, DbSet<T> cannot be created and all repository calls fail with InvalidOperationException.
    /// </summary>
    public class HrmsEntityConfigurator : IPostgresEntityConfigurator
    {
        public void Configure(ModelBuilder modelBuilder)
        {
            // User
            modelBuilder.Entity<User>(e =>
            {
                e.ToTable("Users");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.Email).IsRequired().HasMaxLength(256);
                e.Property(x => x.PasswordHash).IsRequired();
                e.Property(x => x.FirstName).HasMaxLength(128);
                e.Property(x => x.LastName).HasMaxLength(128);
                e.Property(x => x.Role).HasMaxLength(64);
                e.HasIndex(x => x.Email).IsUnique();
            });

            // Attendance
            modelBuilder.Entity<Attendance>(e =>
            {
                e.ToTable("Attendance");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.UserId).IsRequired().HasMaxLength(128);
                e.Property(x => x.Status).HasMaxLength(64);
                e.HasIndex(x => x.UserId);
            });

            // LeaveRequest
            modelBuilder.Entity<LeaveRequest>(e =>
            {
                e.ToTable("LeaveRequests");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.UserId).IsRequired().HasMaxLength(128);
                e.Property(x => x.LeaveType).HasMaxLength(64);
                e.Property(x => x.Status).HasMaxLength(64);
                e.Property(x => x.Reason).HasMaxLength(1024);
                e.HasIndex(x => x.UserId);
            });

            // PayrollRecord
            modelBuilder.Entity<PayrollRecord>(e =>
            {
                e.ToTable("PayrollRecords");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.UserId).IsRequired().HasMaxLength(128);
                e.Property(x => x.PayPeriod).HasMaxLength(64);
                e.Property(x => x.Status).HasMaxLength(64);
                e.HasIndex(x => x.UserId);
            });

            // Reimbursement
            modelBuilder.Entity<Reimbursement>(e =>
            {
                e.ToTable("Reimbursements");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.UserId).IsRequired().HasMaxLength(128);
                e.Property(x => x.ExpenseType).HasMaxLength(128);
                e.Property(x => x.Status).HasMaxLength(64);
                e.Property(x => x.Description).HasMaxLength(1024);
                e.HasIndex(x => x.UserId);
            });

            // PerformanceReview
            modelBuilder.Entity<PerformanceReview>(e =>
            {
                e.ToTable("PerformanceReviews");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.RevieweeId).IsRequired().HasMaxLength(128);
                e.Property(x => x.ReviewerId).HasMaxLength(128);
                e.Property(x => x.ReviewPeriod).HasMaxLength(64);
                e.Property(x => x.Feedback).HasMaxLength(2048);
                e.HasIndex(x => x.RevieweeId);
            });

            // Contribution
            modelBuilder.Entity<Contribution>(e =>
            {
                e.ToTable("Contributions");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.UserId).IsRequired().HasMaxLength(128);
                e.Property(x => x.ContributionType).HasMaxLength(128);
                e.Property(x => x.Month).HasMaxLength(32);
                e.HasIndex(x => x.UserId);
            });

            // TrainingSession
            modelBuilder.Entity<TrainingSession>(e =>
            {
                e.ToTable("TrainingSessions");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.Title).IsRequired().HasMaxLength(256);
                e.Property(x => x.Description).HasMaxLength(2048);
                e.Property(x => x.Instructor).HasMaxLength(256);
            });

            // JobPosting
            modelBuilder.Entity<JobPosting>(e =>
            {
                e.ToTable("JobPostings");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.JobTitle).IsRequired().HasMaxLength(256);
                e.Property(x => x.Department).HasMaxLength(128);
                e.Property(x => x.Description).HasMaxLength(4096);
                e.Property(x => x.Location).HasMaxLength(256);
                e.Property(x => x.Status).HasMaxLength(64);
            });

            // Announcement
            modelBuilder.Entity<Announcement>(e =>
            {
                e.ToTable("Announcements");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.Title).IsRequired().HasMaxLength(256);
                e.Property(x => x.Content).HasMaxLength(8192);
                e.Property(x => x.AuthorId).HasMaxLength(128);
            });

            // Team
            modelBuilder.Entity<Team>(e =>
            {
                e.ToTable("Teams");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.Name).IsRequired().HasMaxLength(256);
                e.Property(x => x.Description).HasMaxLength(1024);
                e.Property(x => x.ManagerId).HasMaxLength(128);
            });

            // Recognition
            modelBuilder.Entity<Recognition>(e =>
            {
                e.ToTable("Recognitions");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.ReceiverId).IsRequired().HasMaxLength(128);
                e.Property(x => x.SenderId).HasMaxLength(128);
                e.Property(x => x.Message).HasMaxLength(2048);
                e.Property(x => x.BadgeType).HasMaxLength(64);
                e.HasIndex(x => x.ReceiverId);
            });

            // AnalyticsReport
            modelBuilder.Entity<AnalyticsReport>(e =>
            {
                e.ToTable("AnalyticsReports");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.ReportName).IsRequired().HasMaxLength(256);
                e.Property(x => x.ReportType).HasMaxLength(128);
                e.Property(x => x.GeneratedBy).HasMaxLength(128);
                e.Property(x => x.DataPayload).HasColumnType("TEXT");
            });

            // CopilotQuery
            modelBuilder.Entity<CopilotQuery>(e =>
            {
                e.ToTable("CopilotQueries");
                e.HasKey(x => x.Id);
                e.Property(x => x.Id).HasMaxLength(128);
                e.Property(x => x.UserId).IsRequired().HasMaxLength(128);
                e.Property(x => x.Prompt).HasColumnType("TEXT");
                e.Property(x => x.Response).HasColumnType("TEXT");
                e.HasIndex(x => x.UserId);
            });
        }
    }
}
