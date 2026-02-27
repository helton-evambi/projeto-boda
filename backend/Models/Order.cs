using System.ComponentModel.DataAnnotations;

namespace BodaApi.Models;

public enum PaymentStatus
{
    Pending,
    Paid,
    Failed,
    Refunded
}

public class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public decimal TotalAmount { get; set; }
    public decimal CommissionAmount { get; set; }

    public PaymentStatus PaymentStatus { get; set; } = PaymentStatus.Pending;

    [MaxLength(50)]
    public string? PaymentMethod { get; set; }

    [MaxLength(200)]
    public string? GatewayReference { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }

    // Navigation
    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}

public class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }
    public Order Order { get; set; } = null!;

    public int TicketId { get; set; }
    public Ticket Ticket { get; set; } = null!;

    public int Quantity { get; set; }
    public decimal Price { get; set; }

    // Navigation
    public ICollection<TicketIssued> IssuedTickets { get; set; } = new List<TicketIssued>();
}

public class TicketIssued
{
    public int Id { get; set; }

    public int OrderItemId { get; set; }
    public OrderItem OrderItem { get; set; } = null!;

    [Required, MaxLength(100)]
    public string TicketCode { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? QrCode { get; set; }

    public bool Used { get; set; }

    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
}
