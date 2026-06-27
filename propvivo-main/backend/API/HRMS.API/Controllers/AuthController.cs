using HRMS.Core.Postgres.Repositories;
using HRMS.Shared.Domain.Entity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace HRMS.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IPostgresRepository<User> _userRepository;
        private readonly IConfiguration _configuration;

        public AuthController(IPostgresRepository<User> userRepository, IConfiguration configuration)
        {
            _userRepository = userRepository;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            // Simple password handling for demonstration (in production, hash the password!)
            var existingUser = await _userRepository.GetItemAsync(u => u.Email == user.Email);
            if (existingUser != null)
                return BadRequest("User already exists");

            user.Id = Guid.NewGuid().ToString();
            user.Role = string.IsNullOrEmpty(user.Role) ? "Employee" : user.Role;
            
            await _userRepository.AddItemAsync(user);
            return Ok(new { message = "User registered successfully" });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await _userRepository.GetItemAsync(u => u.Email == request.Email && u.PasswordHash == request.Password);
            if (user == null)
                return Unauthorized("Invalid credentials");

            var tokenHandler = new JwtSecurityTokenHandler();
            var keyStr = _configuration["Jwt:Key"] ?? "SuperSecretKeyForDevelopmentOnlyPleaseChangeInProduction123!";
            var key = Encoding.ASCII.GetBytes(keyStr);
            
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] 
                { 
                    new Claim(ClaimTypes.NameIdentifier, user.Id),
                    new Claim(ClaimTypes.Email, user.Email),
                    new Claim(ClaimTypes.Role, user.Role)
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return Ok(new { 
                token = tokenHandler.WriteToken(token), 
                user = new { 
                    user.Id, 
                    user.FirstName, 
                    user.LastName, 
                    name = $"{user.FirstName} {user.LastName}".Trim(),
                    user.Email, 
                    user.Role 
                } 
            });
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
