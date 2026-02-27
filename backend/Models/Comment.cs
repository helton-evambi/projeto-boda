using System.ComponentModel.DataAnnotations;

namespace BodaApi.Models;

public enum CommentStatus
{
    Approved,
    Pending,
    Rejected,
    Reported
}

public class Comment
{
    public int Id { get; set; }

    public int EventId { get; set; }
    public Event Event { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int Rating { get; set; } // 1-5

    [MaxLength(2000)]
    public string? Body { get; set; }

    public CommentStatus Status { get; set; } = CommentStatus.Approved;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
