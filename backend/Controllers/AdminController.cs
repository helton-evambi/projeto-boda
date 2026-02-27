using BodaApi.Data;
using BodaApi.DTOs;
using BodaApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly BodaDbContext _db;

    public AdminController(BodaDbContext db) => _db = db;

    [HttpGet("dashboard")]
    public async Task<ActionResult<DashboardStatsDto>> GetDashboard()
    {
        var stats = new DashboardStatsDto
        {
            TotalUsers = await _db.Users.CountAsync(),
            TotalEvents = await _db.Events.CountAsync(),
            TotalOrders = await _db.Orders.CountAsync(),
            TotalRevenue = await _db.Orders.Where(o => o.PaymentStatus == PaymentStatus.Paid).SumAsync(o => o.TotalAmount),
            TotalCommission = await _db.Orders.Where(o => o.PaymentStatus == PaymentStatus.Paid).SumAsync(o => o.CommissionAmount),
            ActiveEvents = await _db.Events.CountAsync(e => e.Status == EventStatus.Published && e.StartDateTime > DateTime.UtcNow),
            PendingEvents = await _db.Events.CountAsync(e => e.Status == EventStatus.PendingApproval),
            RecentOrders = await _db.Orders
                .Include(o => o.User)
                .Include(o => o.Items).ThenInclude(i => i.Ticket).ThenInclude(t => t.Event)
                .OrderByDescending(o => o.CreatedAt)
                .Take(10)
                .Select(o => new RecentOrderDto
                {
                    Id = o.Id,
                    UserName = o.User.Name,
                    EventTitle = o.Items.FirstOrDefault() != null ? o.Items.First().Ticket.Event.Title : null,
                    Amount = o.TotalAmount,
                    Status = o.PaymentStatus.ToString(),
                    CreatedAt = o.CreatedAt
                })
                .ToListAsync()
        };

        return Ok(stats);
    }

    [HttpGet("users")]
    public async Task<ActionResult<List<UserDto>>> GetUsers([FromQuery] string? role)
    {
        var query = _db.Users.AsQueryable();

        if (!string.IsNullOrEmpty(role) && Enum.TryParse<UserRole>(role, true, out var userRole))
            query = query.Where(u => u.Role == userRole);

        var users = await query.OrderByDescending(u => u.CreatedAt).ToListAsync();

        return Ok(users.Select(u => new UserDto
        {
            Id = u.Id,
            Name = u.Name,
            Email = u.Email,
            Phone = u.Phone,
            Role = u.Role.ToString(),
            Verified = u.Verified,
            Bio = u.Bio,
            AvatarUrl = u.AvatarUrl,
            Location = u.Location,
            CompanyName = u.CompanyName,
            DocumentVerified = u.DocumentVerified,
            CreatedAt = u.CreatedAt
        }).ToList());
    }

    [HttpGet("events")]
    public async Task<ActionResult<List<EventDto>>> GetEvents([FromQuery] string? status)
    {
        var query = _db.Events
            .Include(e => e.Organizer)
            .Include(e => e.Venue)
            .Include(e => e.Tickets)
            .Include(e => e.Comments)
            .AsQueryable();

        if (!string.IsNullOrEmpty(status) && Enum.TryParse<EventStatus>(status, true, out var eventStatus))
            query = query.Where(e => e.Status == eventStatus);

        var events = await query.OrderByDescending(e => e.CreatedAt).ToListAsync();

        return Ok(events.Select(e => new EventDto
        {
            Id = e.Id,
            OrganizerId = e.OrganizerId,
            OrganizerName = e.Organizer.Name,
            OrganizerAvatar = e.Organizer.AvatarUrl,
            Title = e.Title,
            Slug = e.Slug,
            Category = e.Category,
            StartDateTime = e.StartDateTime,
            EndDateTime = e.EndDateTime,
            Capacity = e.Capacity,
            Status = e.Status.ToString(),
            ImageUrl = e.ImageUrl,
            IsFeatured = e.IsFeatured,
            LikesCount = e.LikesCount,
            CommentsCount = e.Comments.Count,
            CreatedAt = e.CreatedAt
        }).ToList());
    }

    [HttpGet("reports/sales")]
    public async Task<IActionResult> SalesReport()
    {
        var orders = await _db.Orders
            .Include(o => o.User)
            .Include(o => o.Items)
                .ThenInclude(oi => oi.Ticket)
                    .ThenInclude(t => t.Event)
            .Where(o => o.PaymentStatus == PaymentStatus.Paid)
            .OrderByDescending(o => o.PaidAt)
            .ToListAsync();

        var report = orders.Select(o => new
        {
            o.Id,
            User = o.User.Name,
            Event = o.Items.FirstOrDefault()?.Ticket?.Event?.Title ?? "N/A",
            o.TotalAmount,
            o.CommissionAmount,
            o.PaymentMethod,
            o.PaidAt
        });

        return Ok(report);
    }
}
