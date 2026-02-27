using System.ComponentModel.DataAnnotations;

namespace BodaApi.DTOs;

public class LoginDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    [Required, MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [MaxLength(20)]
    public string? Phone { get; set; }

    public string Role { get; set; } = "User"; // User, Organizer, DjArtist
}

public class UpdateProfileDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    [MaxLength(20)]
    public string? Phone { get; set; }

    [MaxLength(500)]
    public string? Bio { get; set; }

    [MaxLength(200)]
    public string? Location { get; set; }

    [MaxLength(300)]
    public string? Website { get; set; }

    [MaxLength(500)]
    public string? AvatarUrl { get; set; }

    [MaxLength(500)]
    public string? CoverUrl { get; set; }

    [MaxLength(200)]
    public string? CompanyName { get; set; }

    [MaxLength(200)]
    public string? ArtistName { get; set; }

    [MaxLength(100)]
    public string? Genre { get; set; }
}

public class ChangePasswordDto
{
    [Required]
    public string CurrentPassword { get; set; } = string.Empty;

    [Required, MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserDto User { get; set; } = null!;
}

public class UserDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string Role { get; set; } = string.Empty;
    public bool Verified { get; set; }
    public string? Bio { get; set; }
    public string? AvatarUrl { get; set; }
    public string? CoverUrl { get; set; }
    public string? Location { get; set; }
    public string? Website { get; set; }
    public string? CompanyName { get; set; }
    public bool DocumentVerified { get; set; }
    public string? ArtistName { get; set; }
    public string? Genre { get; set; }
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
    public int EventsCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class EventDto
{
    public int Id { get; set; }
    public int OrganizerId { get; set; }
    public string OrganizerName { get; set; } = string.Empty;
    public string? OrganizerAvatar { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Category { get; set; }
    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public int Capacity { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? VideoUrl { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsHybrid { get; set; }
    public int MinAge { get; set; }
    public string? RefundPolicy { get; set; }
    public int LikesCount { get; set; }
    public int SharesCount { get; set; }
    public int CommentsCount { get; set; }
    public VenueDto? Venue { get; set; }
    public List<TicketDto> Tickets { get; set; } = new();
    public DateTime CreatedAt { get; set; }
}

public class VenueDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Address { get; set; }
    public string? City { get; set; }
    public double? Lat { get; set; }
    public double? Lng { get; set; }
    public int Capacity { get; set; }
}

public class TicketDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int QuantityTotal { get; set; }
    public int QuantitySold { get; set; }
    public int Available => QuantityTotal - QuantitySold;
}

public class CommentDto
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? UserAvatar { get; set; }
    public int Rating { get; set; }
    public string? Body { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateCommentDto
{
    [Range(1, 5)]
    public int Rating { get; set; }

    [MaxLength(2000)]
    public string? Body { get; set; }
}

public class MessageDto
{
    public int Id { get; set; }
    public int FromUserId { get; set; }
    public string FromUserName { get; set; } = string.Empty;
    public string? FromUserAvatar { get; set; }
    public int ToUserId { get; set; }
    public string ToUserName { get; set; } = string.Empty;
    public string? Subject { get; set; }
    public string Body { get; set; } = string.Empty;
    public bool Read { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class SendMessageDto
{
    [Required]
    public int ToUserId { get; set; }

    [MaxLength(200)]
    public string? Subject { get; set; }

    [Required, MaxLength(5000)]
    public string Body { get; set; } = string.Empty;
}

public class NotificationDto
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string? Payload { get; set; }
    public bool Read { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreateEventDto
{
    [Required, MaxLength(200)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(5000)]
    public string? Description { get; set; }

    [MaxLength(100)]
    public string? Category { get; set; }

    public DateTime StartDateTime { get; set; }
    public DateTime EndDateTime { get; set; }
    public int Capacity { get; set; }
    public int? VenueId { get; set; }

    [MaxLength(500)]
    public string? ImageUrl { get; set; }

    public int MinAge { get; set; }

    [MaxLength(2000)]
    public string? RefundPolicy { get; set; }

    public bool IsHybrid { get; set; }

    /// <summary>Ticket tiers to create with the event</summary>
    public List<CreateTicketDto>? Tickets { get; set; }
}

public class CreateTicketDto
{
    public string Type { get; set; } = "Normal"; // Free, Normal, VIP, EarlyBird
    public decimal Price { get; set; }
    public int QuantityTotal { get; set; }
}

public class DashboardStatsDto
{
    public int TotalUsers { get; set; }
    public int TotalEvents { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal TotalCommission { get; set; }
    public int ActiveEvents { get; set; }
    public int PendingEvents { get; set; }
    public List<RecentOrderDto> RecentOrders { get; set; } = new();
}

public class RecentOrderDto
{
    public int Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string? EventTitle { get; set; }
    public decimal Amount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

// ── Orders & Checkout ──────────────────────────────────

public class CheckoutDto
{
    [Required]
    public int TicketId { get; set; }

    [Range(1, 10)]
    public int Quantity { get; set; } = 1;

    [MaxLength(50)]
    public string? PromoCode { get; set; }

    [MaxLength(50)]
    public string? PaymentMethod { get; set; }
}

public class ValidatePromoDto
{
    [Required, MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    public int? EventId { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public int EventId { get; set; }
    public string? EventTitle { get; set; }
    public string? EventImage { get; set; }
    public string? VenueName { get; set; }
    public string? VenueCity { get; set; }
    public DateTime? EventDate { get; set; }
    public string? TicketType { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal Discount { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal Commission { get; set; }
    public string? PaymentMethod { get; set; }
    public string PaymentStatus { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? PaidAt { get; set; }
    public List<IssuedTicketDto> Tickets { get; set; } = new();
}

public class IssuedTicketDto
{
    public int Id { get; set; }
    public string TicketCode { get; set; } = string.Empty;
    public string? QrCodeUrl { get; set; }
    public bool Used { get; set; }
}

public class SearchSuggestionDto
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Category { get; set; }
    public string? ImageUrl { get; set; }
    public string? City { get; set; }
    public DateTime StartDateTime { get; set; }
}
