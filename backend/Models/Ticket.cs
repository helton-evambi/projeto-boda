using System.ComponentModel.DataAnnotations;

namespace BodaApi.Models;

public enum TicketType
{
    Free,
    Normal,
    VIP,
    EarlyBird
}

public class Ticket
{
    public int Id { get; set; }

    public int EventId { get; set; }
    public Event Event { get; set; } = null!;

    public TicketType Type { get; set; } = TicketType.Normal;

    public decimal Price { get; set; }

    public int QuantityTotal { get; set; }
    public int QuantitySold { get; set; }

    public DateTime? SalesStart { get; set; }
    public DateTime? SalesEnd { get; set; }

    // Navigation
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
