using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TarefasAcademicas.Api.DTOs;
using TarefasAcademicas.Api.Services;

namespace TarefasAcademicas.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/disciplinas")]
public class DisciplinasController : ControllerBase
{
    private readonly DisciplinaService _disciplinaService;

    public DisciplinasController(DisciplinaService disciplinaService)
    {
        _disciplinaService = disciplinaService;
    }

    private int UsuarioId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<List<DisciplinaDto>>> Listar()
    {
        return Ok(await _disciplinaService.Listar(UsuarioId));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<DisciplinaDto>> Obter(int id)
    {
        var disciplina = await _disciplinaService.ObterPorId(id, UsuarioId);
        if (disciplina == null)
            return NotFound();

        return Ok(disciplina);
    }

    [HttpPost]
    public async Task<ActionResult<DisciplinaDto>> Criar(SalvarDisciplinaDto dto)
    {
        var disciplina = await _disciplinaService.Criar(UsuarioId, dto);
        return CreatedAtAction(nameof(Obter), new { id = disciplina.Id }, disciplina);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<DisciplinaDto>> Atualizar(int id, SalvarDisciplinaDto dto)
    {
        var disciplina = await _disciplinaService.Atualizar(id, UsuarioId, dto);
        if (disciplina == null)
            return NotFound();

        return Ok(disciplina);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        try
        {
            if (!await _disciplinaService.Excluir(id, UsuarioId))
                return NotFound();

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }
}
