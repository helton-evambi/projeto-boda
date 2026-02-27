using System.ComponentModel.DataAnnotations;

namespace BodaApi.Models;

public class Notification
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    [Required, MaxLength(50)]
    public string Type { get; set; } = string.Empty; // ticket_purchased, event_reminder, new_follower, new_message, event_cancelled

    [MaxLength(500)]
    public string? Title { get; set; }

    [MaxLength(2000)]
    public string? Payload { get; set; }

    public bool Read { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
