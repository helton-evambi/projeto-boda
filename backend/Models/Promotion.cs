using System.ComponentModel.DataAnnotations;

namespace BodaApi.Models;

public class Promotion
{
    public int Id { get; set; }

    [Required, MaxLength(50)]
    public string Code { get; set; } = string.Empty;

    [MaxLength(20)]
    public string DiscountType { get; set; } = "percentage"; // percentage, fixed

    public decimal Value { get; set; }

    public int? EventId { get; set; }
    public Event? Event { get; set; }

    public int UsesLimit { get; set; }
    public int UsesCount { get; set; }

    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
