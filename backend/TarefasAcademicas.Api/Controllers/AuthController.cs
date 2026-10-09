using Microsoft.AspNetCore.Mvc;
using TarefasAcademicas.Api.DTOs;
using TarefasAcademicas.Api.Services;

namespace TarefasAcademicas.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("cadastro")]
    public async Task<ActionResult<LoginRespostaDto>> Cadastrar(CadastroDto dto)
    {
        try
        {
            return Ok(await _authService.Cadastrar(dto));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<LoginRespostaDto>> Login(LoginDto dto)
    {
        var resposta = await _authService.Login(dto);
        if (resposta == null)
            return Unauthorized(new { mensagem = "E-mail ou senha inválidos." });

        return Ok(resposta);
    }
}
