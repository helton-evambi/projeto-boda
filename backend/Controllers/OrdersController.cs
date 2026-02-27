using System.Security.Claims;
using BodaApi.Data;
using BodaApi.DTOs;
using BodaApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly BodaDbContext _db;

    public OrdersController(BodaDbContext db) => _db = db;

    /// <summary>
    /// Checkout: purchase tickets with optional promo code
    /// </summary>
    [HttpPost("checkout")]
    public async Task<ActionResult<OrderDto>> Checkout(CheckoutDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var ticket = await _db.Tickets.Include(t => t.Event).FirstOrDefaultAsync(t => t.Id == dto.TicketId);

        if (ticket == null)
            return NotFound(new { message = "Bilhete não encontrado." });

        if (ticket.QuantityTotal - ticket.QuantitySold < dto.Quantity)
            return BadRequest(new { message = "Quantidade insuficiente disponível." });

        var unitPrice = ticket.Price;
        var subtotal = unitPrice * dto.Quantity;
        var discount = 0m;

        // Validate promo code
        if (!string.IsNullOrEmpty(dto.PromoCode))
        {
            var promo = await _db.Promotions.FirstOrDefaultAsync(p =>
                p.Code == dto.PromoCode.ToUpper() &&
                p.ValidFrom <= DateTime.UtcNow &&
                p.ValidTo >= DateTime.UtcNow &&
                p.UsesCount < p.UsesLimit &&
                (p.EventId == null || p.EventId == ticket.EventId));

            if (promo != null)
            {
                if (promo.DiscountType == "percentage")
                    discount = subtotal * (promo.Value / 100m);
                else
                    discount = Math.Min(promo.Value, subtotal);

                promo.UsesCount++;
            }
        }

        var total = Math.Max(subtotal - discount, 0);
        var commission = total * 0.07m;

        // Create order
        var order = new Order
        {
            UserId = userId,
            TotalAmount = total,
            CommissionAmount = commission,
            PaymentStatus = PaymentStatus.Paid, // Auto-confirm for demo
            PaymentMethod = dto.PaymentMethod ?? "Multicaixa",
            CreatedAt = DateTime.UtcNow,
            PaidAt = DateTime.UtcNow
        };
        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        // Create order item
        var item = new OrderItem
        {
            OrderId = order.Id,
            TicketId = ticket.Id,
            Quantity = dto.Quantity,
            Price = unitPrice
        };
        _db.OrderItems.Add(item);

        // Update sold count
        ticket.QuantitySold += dto.Quantity;
        await _db.SaveChangesAsync();

        // Issue tickets with QR codes
        var issuedTickets = new List<TicketIssued>();
        for (int i = 0; i < dto.Quantity; i++)
        {
            var code = $"BODA-{DateTime.UtcNow.Year}-{order.Id:D4}-{i + 1:D2}";
            var issued = new TicketIssued
            {
                OrderItemId = item.Id,
                TicketCode = code,
                QrCode = $"https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={code}",
                Used = false,
                IssuedAt = DateTime.UtcNow
            };
            issuedTickets.Add(issued);
            _db.TicketsIssued.Add(issued);
        }
        await _db.SaveChangesAsync();

        // Create notification
        _db.Notifications.Add(new Notification
        {
            UserId = userId,
            Type = "ticket_purchased",
            Title = $"Bilhete comprado — {ticket.Event.Title} ({ticket.Type} x{dto.Quantity})",
            CreatedAt = DateTime.UtcNow
        });
        await _db.SaveChangesAsync();

        return Ok(new OrderDto
        {
            Id = order.Id,
            EventId = ticket.EventId,
            EventTitle = ticket.Event.Title,
            EventImage = ticket.Event.ImageUrl,
            TicketType = ticket.Type.ToString(),
            Quantity = dto.Quantity,
            UnitPrice = unitPrice,
            Discount = discount,
            TotalAmount = total,
            Commission = commission,
            PaymentMethod = order.PaymentMethod,
            PaymentStatus = order.PaymentStatus.ToString(),
            CreatedAt = order.CreatedAt,
            PaidAt = order.PaidAt,
            Tickets = issuedTickets.Select(t => new IssuedTicketDto
            {
                Id = t.Id,
                TicketCode = t.TicketCode,
                QrCodeUrl = t.QrCode,
                Used = t.Used
            }).ToList()
        });
    }

    /// <summary>
    /// List current user's orders
    /// </summary>
    [HttpGet("my")]
    public async Task<ActionResult<List<OrderDto>>> GetMyOrders()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var orders = await _db.Orders
            .Where(o => o.UserId == userId)
            .Include(o => o.Items)
                .ThenInclude(i => i.Ticket)
                    .ThenInclude(t => t.Event)
                        .ThenInclude(e => e.Venue)
            .Include(o => o.Items)
                .ThenInclude(i => i.IssuedTickets)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();

        return Ok(orders.Select(o =>
        {
            var firstItem = o.Items.FirstOrDefault();
            var ticket = firstItem?.Ticket;
            var ev = ticket?.Event;
            return new OrderDto
            {
                Id = o.Id,
                EventId = ev?.Id ?? 0,
                EventTitle = ev?.Title ?? "Evento",
                EventImage = ev?.ImageUrl,
                VenueName = ev?.Venue?.Name,
                VenueCity = ev?.Venue?.City,
                EventDate = ev?.StartDateTime,
                TicketType = ticket?.Type.ToString() ?? "Standard",
                Quantity = firstItem?.Quantity ?? 0,
                UnitPrice = firstItem?.Price ?? 0,
                TotalAmount = o.TotalAmount,
                Commission = o.CommissionAmount,
                PaymentMethod = o.PaymentMethod,
                PaymentStatus = o.PaymentStatus.ToString(),
                CreatedAt = o.CreatedAt,
                PaidAt = o.PaidAt,
                Tickets = firstItem?.IssuedTickets.Select(t => new IssuedTicketDto
                {
                    Id = t.Id,
                    TicketCode = t.TicketCode,
                    QrCodeUrl = t.QrCode,
                    Used = t.Used
                }).ToList() ?? new()
            };
        }).ToList());
    }

    /// <summary>
    /// Validate promo code
    /// </summary>
    [HttpPost("validate-promo")]
    public async Task<IActionResult> ValidatePromo(ValidatePromoDto dto)
    {
        var promo = await _db.Promotions.FirstOrDefaultAsync(p =>
            p.Code == dto.Code.ToUpper() &&
            p.ValidFrom <= DateTime.UtcNow &&
            p.ValidTo >= DateTime.UtcNow &&
            p.UsesCount < p.UsesLimit &&
            (p.EventId == null || p.EventId == dto.EventId));

        if (promo == null)
            return NotFound(new { message = "Código inválido ou expirado." });

        return Ok(new
        {
            code = promo.Code,
            discountType = promo.DiscountType,
            value = promo.Value,
            valid = true
        });
    }
}
