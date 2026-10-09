using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using TarefasAcademicas.Api.DTOs;
using TarefasAcademicas.Api.Models;
using TarefasAcademicas.Api.Repositories;

namespace TarefasAcademicas.Api.Services;

public class AuthService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IConfiguration _configuration;
    private readonly PasswordHasher<Usuario> _passwordHasher = new();

    public AuthService(IUsuarioRepository usuarioRepository, IConfiguration configuration)
    {
        _usuarioRepository = usuarioRepository;
        _configuration = configuration;
    }

    public async Task<LoginRespostaDto> Cadastrar(CadastroDto dto)
    {
        var email = dto.Email.Trim().ToLower();

        if (await _usuarioRepository.ObterPorEmail(email) != null)
            throw new InvalidOperationException("Este e-mail já está cadastrado.");

        var usuario = new Usuario
        {
            Nome = dto.Nome.Trim(),
            Email = email,
            CriadoEm = DateTime.UtcNow
        };
        usuario.SenhaHash = _passwordHasher.HashPassword(usuario, dto.Senha);

        await _usuarioRepository.Adicionar(usuario);

        return new LoginRespostaDto { Token = GerarToken(usuario), Nome = usuario.Nome };
    }

    public async Task<LoginRespostaDto?> Login(LoginDto dto)
    {
        var usuario = await _usuarioRepository.ObterPorEmail(dto.Email.Trim().ToLower());
        if (usuario == null)
            return null;

        var resultado = _passwordHasher.VerifyHashedPassword(usuario, usuario.SenhaHash, dto.Senha);
        if (resultado == PasswordVerificationResult.Failed)
            return null;

        return new LoginRespostaDto { Token = GerarToken(usuario), Nome = usuario.Nome };
    }

    private string GerarToken(Usuario usuario)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Name, usuario.Nome),
            new Claim(ClaimTypes.Email, usuario.Email)
        };

        var chave = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(chave, SecurityAlgorithms.HmacSha256));

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
