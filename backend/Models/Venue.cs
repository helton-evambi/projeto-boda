using System.ComponentModel.DataAnnotations;

namespace BodaApi.Models;

public class Venue
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Address { get; set; }

    [MaxLength(100)]
    public string? City { get; set; }

    public double? Lat { get; set; }
    public double? Lng { get; set; }

    public int Capacity { get; set; }

    [MaxLength(200)]
    public string? ContactInfo { get; set; }

    // Navigation
    public ICollection<Event> Events { get; set; } = new List<Event>();
}
