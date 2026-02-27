using System.ComponentModel.DataAnnotations;

namespace BodaApi.Models;

public enum EventStatus
{
    Draft,
    PendingApproval,
    Published,
    Cancelled,
    Completed
}

public class Event
{
    public int Id { get; set; }

    public int OrganizerId { get; set; }
    public User Organizer { get; set; } = null!;

    public int? VenueId { get; set; }
    public Venue? Venue { get; set; }

    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Slug { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string? Description { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }

    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }

    public int Capacity { get; set; }

    public EventStatus Status { get; set; } = EventStatus.Published;

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    [MaxLength(500)]
    public string? VideoUrl { get; set; }

    public bool IsFeatured { get; set; }

    public bool IsHybrid { get; set; }

    [MaxLength(500)]
    public string? StreamUrl { get; set; }

    public int MinAge { get; set; }

    [MaxLength(2000)]
    public string? RefundPolicy { get; set; }

    public int LikesCount { get; set; }
    public int SharesCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Ticket> Tickets { get; set; } = new List<Ticket>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
}
