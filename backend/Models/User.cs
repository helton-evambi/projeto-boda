using System.ComponentModel.DataAnnotations;

namespace BodaApi.Models;

public enum UserRole
{
    User,
    Organizer,
    DjArtist,
    Admin,
    Developer
}

public class User
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Email { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Phone { get; set; }

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.User;

    public bool Verified { get; set; }

    [MaxLength(500)]
    public string? Bio { get; set; }

    [MaxLength(300)]
    public string? AvatarUrl { get; set; }

    [MaxLength(300)]
    public string? CoverUrl { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [MaxLength(300)]
    public string? Website { get; set; }

    // Organizer-specific
    [MaxLength(200)]
    public string? CompanyName { get; set; }

    public bool DocumentVerified { get; set; }

    // DJ/Artist-specific
    [MaxLength(200)]
    public string? ArtistName { get; set; }

    [MaxLength(100)]
    public string? Genre { get; set; }

    // Social stats (denormalized)
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public int EventsCount { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<Event> OrganizedEvents { get; set; } = new List<Event>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public ICollection<Follow> Followers { get; set; } = new List<Follow>();
    public ICollection<Follow> Following { get; set; } = new List<Follow>();
    public ICollection<Notification> Notifications { get; set; } = new List<Notification>();
}
