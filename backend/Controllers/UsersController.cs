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
public class UsersController : ControllerBase
{
    private readonly BodaDbContext _db;

    public UsersController(BodaDbContext db) => _db = db;

    [HttpGet("{id}")]
    public async Task<ActionResult<UserDto>> GetById(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null) return NotFound();

        return Ok(new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            Verified = user.Verified,
            Bio = user.Bio,
            AvatarUrl = user.AvatarUrl,
            CoverUrl = user.CoverUrl,
            Location = user.Location,
            Website = user.Website,
            CompanyName = user.CompanyName,
            DocumentVerified = user.DocumentVerified,
            ArtistName = user.ArtistName,
            Genre = user.Genre,
            FollowersCount = await _db.Follows.CountAsync(f => f.FollowingId == user.Id),
            FollowingCount = await _db.Follows.CountAsync(f => f.FollowerId == user.Id),
            EventsCount = await _db.Events.CountAsync(e => e.OrganizerId == user.Id),
            CreatedAt = user.CreatedAt
        });
    }

    [HttpGet]
    public async Task<ActionResult<List<UserDto>>> GetAll([FromQuery] string? role)
    {
        var query = _db.Users.AsQueryable();

        if (!string.IsNullOrEmpty(role) && Enum.TryParse<UserRole>(role, true, out var userRole))
            query = query.Where(u => u.Role == userRole);

        var users = await query.OrderBy(u => u.Name).ToListAsync();

        var result = new List<UserDto>();
        foreach (var u in users)
        {
            result.Add(new UserDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role.ToString(),
                Verified = u.Verified,
                Bio = u.Bio,
                AvatarUrl = u.AvatarUrl,
                Location = u.Location,
                CompanyName = u.CompanyName,
                ArtistName = u.ArtistName,
                Genre = u.Genre,
                FollowersCount = await _db.Follows.CountAsync(f => f.FollowingId == u.Id),
                FollowingCount = await _db.Follows.CountAsync(f => f.FollowerId == u.Id),
                EventsCount = await _db.Events.CountAsync(e => e.OrganizerId == u.Id),
                CreatedAt = u.CreatedAt
            });
        }

        return Ok(result);
    }

    [Authorize]
    [HttpPost("{id}/follow")]
    public async Task<IActionResult> Follow(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        if (userId == id) return BadRequest(new { message = "Não podes seguir a ti mesmo." });

        var exists = await _db.Follows.AnyAsync(f => f.FollowerId == userId && f.FollowingId == id);
        if (exists) return BadRequest(new { message = "Já segues este utilizador." });

        _db.Follows.Add(new Follow { FollowerId = userId, FollowingId = id });
        await _db.SaveChangesAsync();

        return Ok(new { message = "A seguir com sucesso!" });
    }

    [Authorize]
    [HttpDelete("{id}/follow")]
    public async Task<IActionResult> Unfollow(int id)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var follow = await _db.Follows.FirstOrDefaultAsync(f => f.FollowerId == userId && f.FollowingId == id);
        if (follow == null) return NotFound();

        _db.Follows.Remove(follow);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Deixaste de seguir." });
    }

    [Authorize]
    [HttpPut("me")]
    public async Task<ActionResult<UserDto>> UpdateProfile(UpdateProfileDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        if (dto.Name != null) user.Name = dto.Name;
        if (dto.Phone != null) user.Phone = dto.Phone;
        if (dto.Bio != null) user.Bio = dto.Bio;
        if (dto.Location != null) user.Location = dto.Location;
        if (dto.Website != null) user.Website = dto.Website;
        if (dto.AvatarUrl != null) user.AvatarUrl = dto.AvatarUrl;
        if (dto.CoverUrl != null) user.CoverUrl = dto.CoverUrl;
        if (dto.CompanyName != null) user.CompanyName = dto.CompanyName;
        if (dto.ArtistName != null) user.ArtistName = dto.ArtistName;
        if (dto.Genre != null) user.Genre = dto.Genre;

        await _db.SaveChangesAsync();

        return Ok(new UserDto
        {
            Id = user.Id,
            Name = user.Name,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            Verified = user.Verified,
            Bio = user.Bio,
            AvatarUrl = user.AvatarUrl,
            CoverUrl = user.CoverUrl,
            Location = user.Location,
            Website = user.Website,
            CompanyName = user.CompanyName,
            DocumentVerified = user.DocumentVerified,
            ArtistName = user.ArtistName,
            Genre = user.Genre,
            FollowersCount = await _db.Follows.CountAsync(f => f.FollowingId == user.Id),
            FollowingCount = await _db.Follows.CountAsync(f => f.FollowerId == user.Id),
            EventsCount = await _db.Events.CountAsync(e => e.OrganizerId == user.Id),
            CreatedAt = user.CreatedAt
        });
    }
}
