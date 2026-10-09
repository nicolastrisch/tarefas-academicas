using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TarefasAcademicas.Api.DTOs;
using TarefasAcademicas.Api.Services;

namespace TarefasAcademicas.Api.Controllers;

[ApiController]
[Authorize]
[Route("api/tarefas")]
public class TarefasController : ControllerBase
{
    private readonly TarefaService _tarefaService;

    public TarefasController(TarefaService tarefaService)
    {
        _tarefaService = tarefaService;
    }

    private int UsuarioId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // painel: pendentes ordenadas pelo prazo, ou as concluídas com ?situacao=Concluida
    [HttpGet]
    public async Task<ActionResult<List<TarefaDto>>> Listar([FromQuery] FiltroTarefaDto filtro)
    {
        return Ok(await _tarefaService.Listar(UsuarioId, filtro));
    }

    [HttpGet("resumo")]
    public async Task<ActionResult<ResumoTarefasDto>> Resumo()
    {
        return Ok(await _tarefaService.Resumo(UsuarioId));
    }

    [HttpGet("calendario")]
    public async Task<ActionResult<List<TarefaDto>>> ListarDoMes(int ano, int mes)
    {
        if (mes < 1 || mes > 12)
            return BadRequest(new { mensagem = "Mês inválido." });

        return Ok(await _tarefaService.ListarDoMes(UsuarioId, ano, mes));
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TarefaDto>> Obter(int id)
    {
        var tarefa = await _tarefaService.ObterPorId(id, UsuarioId);
        if (tarefa == null)
            return NotFound();

        return Ok(tarefa);
    }

    [HttpPost]
    public async Task<ActionResult<TarefaDto>> Criar(SalvarTarefaDto dto)
    {
        try
        {
            var tarefa = await _tarefaService.Criar(UsuarioId, dto);
            return CreatedAtAction(nameof(Obter), new { id = tarefa.Id }, tarefa);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<TarefaDto>> Atualizar(int id, SalvarTarefaDto dto)
    {
        try
        {
            var tarefa = await _tarefaService.Atualizar(id, UsuarioId, dto);
            if (tarefa == null)
                return NotFound();

            return Ok(tarefa);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { mensagem = ex.Message });
        }
    }

    [HttpPatch("{id}/situacao")]
    public async Task<ActionResult<TarefaDto>> AlterarSituacao(int id, AlterarSituacaoDto dto)
    {
        var tarefa = await _tarefaService.AlterarSituacao(id, UsuarioId, dto.Situacao);
        if (tarefa == null)
            return NotFound();

        return Ok(tarefa);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Excluir(int id)
    {
        if (!await _tarefaService.Excluir(id, UsuarioId))
            return NotFound();

        return NoContent();
    }
}
