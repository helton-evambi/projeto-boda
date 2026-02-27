using Microsoft.EntityFrameworkCore;
using BodaApi.Models;

namespace BodaApi.Data;

public class BodaDbContext : DbContext
{
    public BodaDbContext(DbContextOptions<BodaDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Event> Events => Set<Event>();
    public DbSet<Venue> Venues => Set<Venue>();
    public DbSet<Ticket> Tickets => Set<Ticket>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderItem> OrderItems => Set<OrderItem>();
    public DbSet<TicketIssued> TicketsIssued => Set<TicketIssued>();
    public DbSet<Message> Messages => Set<Message>();
    public DbSet<Comment> Comments => Set<Comment>();
    public DbSet<Notification> Notifications => Set<Notification>();
    public DbSet<Promotion> Promotions => Set<Promotion>();
    public DbSet<Follow> Follows => Set<Follow>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Event
        modelBuilder.Entity<Event>()
            .HasIndex(e => e.Slug)
            .IsUnique();

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Organizer)
            .WithMany(u => u.OrganizedEvents)
            .HasForeignKey(e => e.OrganizerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Event>()
            .HasOne(e => e.Venue)
            .WithMany(v => v.Events)
            .HasForeignKey(e => e.VenueId)
            .OnDelete(DeleteBehavior.SetNull);

        // Ticket
        modelBuilder.Entity<Ticket>()
            .HasOne(t => t.Event)
            .WithMany(e => e.Tickets)
            .HasForeignKey(t => t.EventId);

        // Order
        modelBuilder.Entity<Order>()
            .HasOne(o => o.User)
            .WithMany(u => u.Orders)
            .HasForeignKey(o => o.UserId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Order)
            .WithMany(o => o.Items)
            .HasForeignKey(oi => oi.OrderId);

        modelBuilder.Entity<OrderItem>()
            .HasOne(oi => oi.Ticket)
            .WithMany(t => t.OrderItems)
            .HasForeignKey(oi => oi.TicketId);

        modelBuilder.Entity<TicketIssued>()
            .HasOne(ti => ti.OrderItem)
            .WithMany(oi => oi.IssuedTickets)
            .HasForeignKey(ti => ti.OrderItemId);

        modelBuilder.Entity<TicketIssued>()
            .HasIndex(ti => ti.TicketCode)
            .IsUnique();

        // Message
        modelBuilder.Entity<Message>()
            .HasOne(m => m.FromUser)
            .WithMany()
            .HasForeignKey(m => m.FromUserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(m => m.ToUser)
            .WithMany()
            .HasForeignKey(m => m.ToUserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Comment
        modelBuilder.Entity<Comment>()
            .HasOne(c => c.Event)
            .WithMany(e => e.Comments)
            .HasForeignKey(c => c.EventId);

        modelBuilder.Entity<Comment>()
            .HasOne(c => c.User)
            .WithMany(u => u.Comments)
            .HasForeignKey(c => c.UserId);

        // Notification
        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId);

        // Follow
        modelBuilder.Entity<Follow>()
            .HasOne(f => f.Follower)
            .WithMany(u => u.Following)
            .HasForeignKey(f => f.FollowerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Follow>()
            .HasOne(f => f.FollowingUser)
            .WithMany(u => u.Followers)
            .HasForeignKey(f => f.FollowingId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Follow>()
            .HasIndex(f => new { f.FollowerId, f.FollowingId })
            .IsUnique();

        // Promotion
        modelBuilder.Entity<Promotion>()
            .HasIndex(p => p.Code)
            .IsUnique();

        modelBuilder.Entity<Promotion>()
            .HasOne(p => p.Event)
            .WithMany()
            .HasForeignKey(p => p.EventId)
            .OnDelete(DeleteBehavior.SetNull);

        // Decimal precision
        modelBuilder.Entity<Ticket>().Property(t => t.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.TotalAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Order>().Property(o => o.CommissionAmount).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<OrderItem>().Property(oi => oi.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<Promotion>().Property(p => p.Value).HasColumnType("decimal(18,2)");
    }
}
