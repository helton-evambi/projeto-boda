using System.ComponentModel.DataAnnotations;

namespace BodaApi.Models;

public class Message
{
    public int Id { get; set; }

    public int FromUserId { get; set; }
    public User FromUser { get; set; } = null!;

    public int ToUserId { get; set; }
    public User ToUser { get; set; } = null!;

    [MaxLength(200)]
    public string? Subject { get; set; }

    [Required, MaxLength(5000)]
    public string Body { get; set; } = string.Empty;

    public bool Read { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
