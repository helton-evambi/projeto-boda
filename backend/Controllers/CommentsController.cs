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
public class CommentsController : ControllerBase
{
    private readonly BodaDbContext _db;

    public CommentsController(BodaDbContext db) => _db = db;

    [HttpGet("event/{eventId}")]
    public async Task<ActionResult<List<CommentDto>>> GetByEvent(int eventId)
    {
        var comments = await _db.Comments
            .Include(c => c.User)
            .Where(c => c.EventId == eventId && c.Status == CommentStatus.Approved)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();

        return Ok(comments.Select(c => new CommentDto
        {
            Id = c.Id,
            EventId = c.EventId,
            UserId = c.UserId,
            UserName = c.User.Name,
            UserAvatar = c.User.AvatarUrl,
            Rating = c.Rating,
            Body = c.Body,
            CreatedAt = c.CreatedAt
        }).ToList());
    }

    [Authorize]
    [HttpPost("event/{eventId}")]
    public async Task<ActionResult<CommentDto>> Create(int eventId, CreateCommentDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);

        var comment = new Comment
        {
            EventId = eventId,
            UserId = userId,
            Rating = dto.Rating,
            Body = dto.Body,
            Status = CommentStatus.Approved
        };

        _db.Comments.Add(comment);
        await _db.SaveChangesAsync();

        return Ok(new CommentDto
        {
            Id = comment.Id,
            EventId = comment.EventId,
            UserId = userId,
            UserName = user!.Name,
            UserAvatar = user.AvatarUrl,
            Rating = comment.Rating,
            Body = comment.Body,
            CreatedAt = comment.CreatedAt
        });
    }

    /// <summary>
    /// Report a comment (creates a pending review flag)
    /// </summary>
    [Authorize]
    [HttpPost("{id}/report")]
    public async Task<IActionResult> Report(int id)
    {
        var comment = await _db.Comments.FindAsync(id);
        if (comment == null) return NotFound();

        comment.Status = CommentStatus.Reported;
        await _db.SaveChangesAsync();
        return Ok(new { message = "Comentário reportado. A equipa vai analisar." });
    }

    /// <summary>
    /// Delete comment (admin or comment owner)
    /// </summary>
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var comment = await _db.Comments.FindAsync(id);
        if (comment == null) return NotFound();

        if (comment.UserId != userId && !User.IsInRole("Admin"))
            return Forbid();

        _db.Comments.Remove(comment);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Comentário eliminado." });
    }
}
