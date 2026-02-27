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
public class MessagesController : ControllerBase
{
    private readonly BodaDbContext _db;

    public MessagesController(BodaDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<MessageDto>>> GetMyMessages()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var messages = await _db.Messages
            .Include(m => m.FromUser)
            .Include(m => m.ToUser)
            .Where(m => m.FromUserId == userId || m.ToUserId == userId)
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        return Ok(messages.Select(m => new MessageDto
        {
            Id = m.Id,
            FromUserId = m.FromUserId,
            FromUserName = m.FromUser.Name,
            FromUserAvatar = m.FromUser.AvatarUrl,
            ToUserId = m.ToUserId,
            ToUserName = m.ToUser.Name,
            Subject = m.Subject,
            Body = m.Body,
            Read = m.Read,
            CreatedAt = m.CreatedAt
        }).ToList());
    }

    [HttpPost]
    public async Task<ActionResult<MessageDto>> Send(SendMessageDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var fromUser = await _db.Users.FindAsync(userId);
        var toUser = await _db.Users.FindAsync(dto.ToUserId);

        if (toUser == null) return NotFound(new { message = "Destinatário não encontrado." });

        var message = new Message
        {
            FromUserId = userId,
            ToUserId = dto.ToUserId,
            Subject = dto.Subject,
            Body = dto.Body
        };

        _db.Messages.Add(message);
        await _db.SaveChangesAsync();

        return Ok(new MessageDto
        {
            Id = message.Id,
            FromUserId = userId,
            FromUserName = fromUser!.Name,
            FromUserAvatar = fromUser.AvatarUrl,
            ToUserId = dto.ToUserId,
            ToUserName = toUser.Name,
            Subject = message.Subject,
            Body = message.Body,
            Read = false,
            CreatedAt = message.CreatedAt
        });
    }
}
