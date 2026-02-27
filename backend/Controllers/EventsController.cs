using System.Security.Claims;
using System.Text.RegularExpressions;
using BodaApi.Data;
using BodaApi.DTOs;
using BodaApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly BodaDbContext _db;

    public EventsController(BodaDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<EventDto>>> GetAll(
        [FromQuery] string? city,
        [FromQuery] string? category,
        [FromQuery] string? q,
        [FromQuery] DateTime? dateFrom,
        [FromQuery] DateTime? dateTo,
        [FromQuery] bool? featured,
        [FromQuery] decimal? priceMin,
        [FromQuery] decimal? priceMax,
        [FromQuery] string? sort,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var query = _db.Events
            .Include(e => e.Organizer)
            .Include(e => e.Venue)
            .Include(e => e.Tickets)
            .Include(e => e.Comments)
            .Where(e => e.Status == EventStatus.Published)
            .AsQueryable();

        if (!string.IsNullOrEmpty(city))
            query = query.Where(e => e.Venue != null && e.Venue.City == city);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(e => e.Category == category);

        if (!string.IsNullOrEmpty(q))
            query = query.Where(e => e.Title.Contains(q) || (e.Description != null && e.Description.Contains(q)));

        if (dateFrom.HasValue)
            query = query.Where(e => e.StartDateTime >= dateFrom);

        if (dateTo.HasValue)
            query = query.Where(e => e.StartDateTime <= dateTo);

        if (featured == true)
            query = query.Where(e => e.IsFeatured);

        if (priceMin.HasValue)
            query = query.Where(e => e.Tickets.Any(t => t.Price >= priceMin));

        if (priceMax.HasValue)
            query = query.Where(e => e.Tickets.Any(t => t.Price <= priceMax));

        // Sorting
        query = sort switch
        {
            "date" => query.OrderBy(e => e.StartDateTime),
            "popular" => query.OrderByDescending(e => e.LikesCount),
            "price_asc" => query.OrderBy(e => e.Tickets.Min(t => t.Price)),
            "price_desc" => query.OrderByDescending(e => e.Tickets.Max(t => t.Price)),
            _ => query.OrderByDescending(e => e.IsFeatured)
                      .ThenByDescending(e => e.LikesCount)
                      .ThenBy(e => e.StartDateTime)
        };

        var total = await query.CountAsync();
        var events = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        Response.Headers.Append("X-Total-Count", total.ToString());

        return Ok(events.Select(MapEventDto).ToList());
    }

    /// <summary>
    /// Autocomplete search — returns top 8 matches
    /// </summary>
    [HttpGet("search")]
    public async Task<ActionResult<List<SearchSuggestionDto>>> Search([FromQuery] string q)
    {
        if (string.IsNullOrEmpty(q) || q.Length < 2)
            return Ok(new List<SearchSuggestionDto>());

        var results = await _db.Events
            .Include(e => e.Venue)
            .Where(e => e.Status == EventStatus.Published &&
                (e.Title.Contains(q) || (e.Description != null && e.Description.Contains(q)) ||
                 (e.Venue != null && e.Venue.Name.Contains(q))))
            .OrderByDescending(e => e.LikesCount)
            .Take(8)
            .Select(e => new SearchSuggestionDto
            {
                Id = e.Id,
                Title = e.Title,
                Slug = e.Slug,
                Category = e.Category,
                ImageUrl = e.ImageUrl,
                City = e.Venue != null ? e.Venue.City : null,
                StartDateTime = e.StartDateTime
            })
            .ToListAsync();

        return Ok(results);
    }

    /// <summary>
    /// List distinct cities from venues
    /// </summary>
    [HttpGet("cities")]
    public async Task<ActionResult<List<string>>> GetCities()
    {
        var cities = await _db.Venues
            .Where(v => v.City != null)
            .Select(v => v.City!)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        return Ok(cities);
    }

    [HttpGet("{slug}")]
    public async Task<ActionResult<EventDto>> GetBySlug(string slug)
    {
        var ev = await _db.Events
            .Include(e => e.Organizer)
            .Include(e => e.Venue)
            .Include(e => e.Tickets)
            .Include(e => e.Comments)
            .FirstOrDefaultAsync(e => e.Slug == slug);

        if (ev == null) return NotFound();
        return Ok(MapEventDto(ev));
    }

    [Authorize(Roles = "Organizer,Admin")]
    [HttpPost]
    public async Task<ActionResult<EventDto>> Create(CreateEventDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var slug = Regex.Replace(dto.Title.ToLower(), @"[^a-z0-9]+", "-").Trim('-');
        var baseSlug = slug;
        var counter = 1;
        while (await _db.Events.AnyAsync(e => e.Slug == slug))
        {
            slug = $"{baseSlug}-{counter++}";
        }

        var ev = new Event
        {
            OrganizerId = userId,
            Title = dto.Title,
            Slug = slug,
            Description = dto.Description,
            Category = dto.Category,
            StartDateTime = dto.StartDateTime,
            EndDateTime = dto.EndDateTime,
            Capacity = dto.Capacity,
            VenueId = dto.VenueId,
            ImageUrl = dto.ImageUrl,
            MinAge = dto.MinAge,
            IsHybrid = dto.IsHybrid,
            RefundPolicy = dto.RefundPolicy,
            Status = EventStatus.Published
        };

        _db.Events.Add(ev);
        await _db.SaveChangesAsync();

        // Create ticket tiers if provided
        if (dto.Tickets?.Any() == true)
        {
            foreach (var t in dto.Tickets)
            {
                if (Enum.TryParse<TicketType>(t.Type, out var ticketType))
                {
                    _db.Tickets.Add(new Ticket
                    {
                        EventId = ev.Id,
                        Type = ticketType,
                        Price = t.Price,
                        QuantityTotal = t.QuantityTotal
                    });
                }
            }
            await _db.SaveChangesAsync();
        }

        ev = await _db.Events
            .Include(e => e.Organizer)
            .Include(e => e.Venue)
            .Include(e => e.Tickets)
            .Include(e => e.Comments)
            .FirstAsync(e => e.Id == ev.Id);

        return CreatedAtAction(nameof(GetBySlug), new { slug = ev.Slug }, MapEventDto(ev));
    }

    /// <summary>
    /// Edit event (organizer/admin only)
    /// </summary>
    [Authorize(Roles = "Organizer,Admin")]
    [HttpPut("{id}")]
    public async Task<ActionResult<EventDto>> Update(int id, CreateEventDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var ev = await _db.Events.Include(e => e.Organizer).Include(e => e.Venue).Include(e => e.Tickets).Include(e => e.Comments)
            .FirstOrDefaultAsync(e => e.Id == id);

        if (ev == null) return NotFound();
        if (ev.OrganizerId != userId && !User.IsInRole("Admin"))
            return Forbid();

        ev.Title = dto.Title;
        ev.Description = dto.Description;
        ev.Category = dto.Category;
        ev.StartDateTime = dto.StartDateTime;
        ev.EndDateTime = dto.EndDateTime;
        ev.Capacity = dto.Capacity;
        ev.ImageUrl = dto.ImageUrl;
        ev.MinAge = dto.MinAge;
        ev.IsHybrid = dto.IsHybrid;
        ev.RefundPolicy = dto.RefundPolicy;

        await _db.SaveChangesAsync();
        return Ok(MapEventDto(ev));
    }

    /// <summary>
    /// Cancel event
    /// </summary>
    [Authorize(Roles = "Organizer,Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var ev = await _db.Events.FindAsync(id);
        if (ev == null) return NotFound();
        if (ev.OrganizerId != userId && !User.IsInRole("Admin"))
            return Forbid();

        ev.Status = EventStatus.Cancelled;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Evento cancelado." });
    }

    /// <summary>
    /// Toggle like on an event
    /// </summary>
    [Authorize]
    [HttpPost("{id}/like")]
    public async Task<IActionResult> ToggleLike(int id)
    {
        var ev = await _db.Events.FindAsync(id);
        if (ev == null) return NotFound();

        ev.LikesCount++;
        await _db.SaveChangesAsync();
        return Ok(new { likesCount = ev.LikesCount });
    }

    /// <summary>
    /// Get attendees (check-in list) for an event
    /// </summary>
    [Authorize(Roles = "Organizer,Admin")]
    [HttpGet("{id}/attendees")]
    public async Task<IActionResult> GetAttendees(int id)
    {
        var attendees = await _db.TicketsIssued
            .Include(ti => ti.OrderItem)
                .ThenInclude(oi => oi.Order)
                    .ThenInclude(o => o.User)
            .Include(ti => ti.OrderItem)
                .ThenInclude(oi => oi.Ticket)
            .Where(ti => ti.OrderItem.Ticket.EventId == id && ti.OrderItem.Order.PaymentStatus == PaymentStatus.Paid)
            .Select(ti => new
            {
                name = ti.OrderItem.Order.User.Name,
                email = ti.OrderItem.Order.User.Email,
                ticketType = ti.OrderItem.Ticket.Type.ToString(),
                ticketCode = ti.TicketCode,
                checkedIn = ti.Used,
                issuedAt = ti.IssuedAt
            })
            .ToListAsync();

        return Ok(attendees);
    }

    [HttpGet("categories")]
    public async Task<ActionResult<List<string>>> GetCategories()
    {
        var categories = await _db.Events
            .Where(e => e.Category != null)
            .Select(e => e.Category!)
            .Distinct()
            .ToListAsync();

        return Ok(categories);
    }

    /// <summary>
    /// Get all venues (for create event form)
    /// </summary>
    [HttpGet("venues")]
    public async Task<ActionResult<List<VenueDto>>> GetVenues()
    {
        var venues = await _db.Venues.ToListAsync();
        return Ok(venues.Select(v => new VenueDto
        {
            Id = v.Id, Name = v.Name, Address = v.Address, City = v.City,
            Lat = v.Lat, Lng = v.Lng, Capacity = v.Capacity
        }).ToList());
    }

    private static EventDto MapEventDto(Event e) => new()
    {
        Id = e.Id,
        OrganizerId = e.OrganizerId,
        OrganizerName = e.Organizer.Name,
        OrganizerAvatar = e.Organizer.AvatarUrl,
        Title = e.Title,
        Slug = e.Slug,
        Description = e.Description,
        Category = e.Category,
        StartDateTime = e.StartDateTime,
        EndDateTime = e.EndDateTime,
        Capacity = e.Capacity,
        Status = e.Status.ToString(),
        ImageUrl = e.ImageUrl,
        VideoUrl = e.VideoUrl,
        IsFeatured = e.IsFeatured,
        IsHybrid = e.IsHybrid,
        MinAge = e.MinAge,
        RefundPolicy = e.RefundPolicy,
        LikesCount = e.LikesCount,
        SharesCount = e.SharesCount,
        CommentsCount = e.Comments.Count,
        Venue = e.Venue != null ? new VenueDto
        {
            Id = e.Venue.Id,
            Name = e.Venue.Name,
            Address = e.Venue.Address,
            City = e.Venue.City,
            Lat = e.Venue.Lat,
            Lng = e.Venue.Lng,
            Capacity = e.Venue.Capacity
        } : null,
        Tickets = e.Tickets.Select(t => new TicketDto
        {
            Id = t.Id,
            Type = t.Type.ToString(),
            Price = t.Price,
            QuantityTotal = t.QuantityTotal,
            QuantitySold = t.QuantitySold
        }).ToList(),
        CreatedAt = e.CreatedAt
    };
}
