using System.Security.Claims;
using BodaApi.Data;
using BodaApi.DTOs;
using BodaApi.Models;
using BodaApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BodaApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly BodaDbContext _db;
    private readonly TokenService _tokenService;

    public AuthController(BodaDbContext db, TokenService tokenService)
    {
        _db = db;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register(RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
            return BadRequest(new { message = "Email já registado." });

        var role = dto.Role switch
        {
            "Organizer" => UserRole.Organizer,
            "DjArtist" => UserRole.DjArtist,
            _ => UserRole.User
        };

        var user = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = role,
            AvatarUrl = $"https://api.dicebear.com/7.x/avataaars/svg?seed={dto.Name.Replace(" ", "").ToLower()}"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _tokenService.CreateToken(user);
        return Ok(new AuthResponseDto
        {
            Token = token,
            User = MapUserDto(user)
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login(LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            return Unauthorized(new { message = "Credenciais inválidas." });

        var token = _tokenService.CreateToken(user);
        return Ok(new AuthResponseDto
        {
            Token = token,
            User = MapUserDto(user)
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDto>> Me()
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        return Ok(MapUserDto(user));
    }

    [Authorize]
    [HttpPut("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordDto dto)
    {
        var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var user = await _db.Users.FindAsync(userId);
        if (user == null) return NotFound();

        if (!BCrypt.Net.BCrypt.Verify(dto.CurrentPassword, user.PasswordHash))
            return BadRequest(new { message = "Password atual incorreta." });

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.NewPassword);
        await _db.SaveChangesAsync();

        return Ok(new { message = "Password alterada com sucesso." });
    }

    private UserDto MapUserDto(User user)
    {
        return new UserDto
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
            FollowersCount = _db.Follows.Count(f => f.FollowingId == user.Id),
            FollowingCount = _db.Follows.Count(f => f.FollowerId == user.Id),
            EventsCount = _db.Events.Count(e => e.OrganizerId == user.Id),
            CreatedAt = user.CreatedAt
        };
    }
}
