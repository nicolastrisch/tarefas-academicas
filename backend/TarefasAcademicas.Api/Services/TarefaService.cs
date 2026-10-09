using TarefasAcademicas.Api.DTOs;
using TarefasAcademicas.Api.Models;
using TarefasAcademicas.Api.Repositories;

namespace TarefasAcademicas.Api.Services;

public class TarefaService
{
    // tarefas que vencem em até 3 dias aparecem destacadas no painel
    public const int DiasPrazoProximo = 3;

    private readonly ITarefaRepository _tarefaRepository;
    private readonly IDisciplinaRepository _disciplinaRepository;

    public TarefaService(ITarefaRepository tarefaRepository, IDisciplinaRepository disciplinaRepository)
    {
        _tarefaRepository = tarefaRepository;
        _disciplinaRepository = disciplinaRepository;
    }

    // lista do painel: sem filtro de situação mostra só as pendentes,
    // e com a situação "Concluida" mostra o histórico das concluídas (RF11)
    public async Task<List<TarefaDto>> Listar(int usuarioId, FiltroTarefaDto filtro)
    {
        var hoje = Hoje();
        IEnumerable<Tarefa> tarefas = await _tarefaRepository.ListarPorUsuario(usuarioId);

        if (filtro.Situacao.HasValue)
            tarefas = tarefas.Where(t => t.Situacao == filtro.Situacao);
        else
            tarefas = tarefas.Where(t => t.Situacao != SituacaoTarefa.Concluida);

        if (filtro.DisciplinaId.HasValue)
            tarefas = tarefas.Where(t => t.DisciplinaId == filtro.DisciplinaId);

        if (filtro.Prioridade.HasValue)
            tarefas = tarefas.Where(t => t.Prioridade == filtro.Prioridade);

        if (filtro.Situacao == SituacaoTarefa.Concluida)
        {
            return tarefas
                .OrderByDescending(t => t.DataEntrega)
                .Select(t => ParaDto(t, hoje))
                .ToList();
        }

        if (filtro.Prazo == "atrasadas")
            tarefas = tarefas.Where(t => t.DataEntrega < hoje);
        else if (filtro.Prazo == "7dias")
            tarefas = tarefas.Where(t => t.DataEntrega >= hoje && t.DataEntrega <= hoje.AddDays(7));
        else if (filtro.Prazo == "30dias")
            tarefas = tarefas.Where(t => t.DataEntrega >= hoje && t.DataEntrega <= hoje.AddDays(30));

        return tarefas
            .OrderBy(t => t.DataEntrega)
            .ThenByDescending(t => t.Prioridade)
            .Select(t => ParaDto(t, hoje))
            .ToList();
    }

    // números mostrados nos cartões do topo do painel
    public async Task<ResumoTarefasDto> Resumo(int usuarioId)
    {
        var hoje = Hoje();
        var tarefas = await _tarefaRepository.ListarPorUsuario(usuarioId);
        var pendentes = tarefas.Where(t => t.Situacao != SituacaoTarefa.Concluida).ToList();

        return new ResumoTarefasDto
        {
            Pendentes = pendentes.Count,
            Atrasadas = pendentes.Count(t => t.DataEntrega < hoje),
            ProximosSeteDias = pendentes.Count(t => t.DataEntrega >= hoje && t.DataEntrega <= hoje.AddDays(7)),
            Concluidas = tarefas.Count - pendentes.Count
        };
    }

    public async Task<List<TarefaDto>> ListarDoMes(int usuarioId, int ano, int mes)
    {
        var hoje = Hoje();
        var tarefas = await _tarefaRepository.ListarPorUsuario(usuarioId);

        return tarefas
            .Where(t => t.DataEntrega.Year == ano && t.DataEntrega.Month == mes)
            .OrderBy(t => t.DataEntrega)
            .Select(t => ParaDto(t, hoje))
            .ToList();
    }

    public async Task<TarefaDto?> ObterPorId(int id, int usuarioId)
    {
        var tarefa = await _tarefaRepository.ObterPorId(id, usuarioId);
        return tarefa == null ? null : ParaDto(tarefa, Hoje());
    }

    public async Task<TarefaDto> Criar(int usuarioId, SalvarTarefaDto dto)
    {
        var disciplina = await _disciplinaRepository.ObterPorId(dto.DisciplinaId, usuarioId);
        if (disciplina == null)
            throw new InvalidOperationException("Disciplina não encontrada.");

        var tarefa = new Tarefa { DisciplinaId = disciplina.Id };
        CopiarDados(dto, tarefa);

        await _tarefaRepository.Adicionar(tarefa);
        tarefa.Disciplina = disciplina;
        return ParaDto(tarefa, Hoje());
    }

    public async Task<TarefaDto?> Atualizar(int id, int usuarioId, SalvarTarefaDto dto)
    {
        var tarefa = await _tarefaRepository.ObterPorId(id, usuarioId);
        if (tarefa == null)
            return null;

        var disciplina = await _disciplinaRepository.ObterPorId(dto.DisciplinaId, usuarioId);
        if (disciplina == null)
            throw new InvalidOperationException("Disciplina não encontrada.");

        tarefa.DisciplinaId = disciplina.Id;
        tarefa.Disciplina = disciplina;
        CopiarDados(dto, tarefa);

        await _tarefaRepository.Atualizar(tarefa);
        return ParaDto(tarefa, Hoje());
    }

    public async Task<TarefaDto?> AlterarSituacao(int id, int usuarioId, SituacaoTarefa situacao)
    {
        var tarefa = await _tarefaRepository.ObterPorId(id, usuarioId);
        if (tarefa == null)
            return null;

        tarefa.Situacao = situacao;
        await _tarefaRepository.Atualizar(tarefa);
        return ParaDto(tarefa, Hoje());
    }

    public async Task<bool> Excluir(int id, int usuarioId)
    {
        var tarefa = await _tarefaRepository.ObterPorId(id, usuarioId);
        if (tarefa == null)
            return false;

        await _tarefaRepository.Remover(tarefa);
        return true;
    }

    public static TarefaDto ParaDto(Tarefa tarefa, DateOnly hoje)
    {
        var diasRestantes = tarefa.DataEntrega.DayNumber - hoje.DayNumber;
        var pendente = tarefa.Situacao != SituacaoTarefa.Concluida;

        return new TarefaDto
        {
            Id = tarefa.Id,
            Titulo = tarefa.Titulo,
            Descricao = tarefa.Descricao,
            Tipo = tarefa.Tipo,
            DataEntrega = tarefa.DataEntrega,
            Prioridade = tarefa.Prioridade,
            Situacao = tarefa.Situacao,
            DisciplinaId = tarefa.DisciplinaId,
            DisciplinaNome = tarefa.Disciplina?.Nome ?? string.Empty,
            DisciplinaCor = tarefa.Disciplina?.Cor ?? string.Empty,
            DiasRestantes = diasRestantes,
            Atrasada = pendente && diasRestantes < 0,
            PrazoProximo = pendente && diasRestantes >= 0 && diasRestantes <= DiasPrazoProximo
        };
    }

    private static void CopiarDados(SalvarTarefaDto dto, Tarefa tarefa)
    {
        tarefa.Titulo = dto.Titulo.Trim();
        tarefa.Descricao = dto.Descricao?.Trim();
        tarefa.Tipo = dto.Tipo;
        tarefa.DataEntrega = dto.DataEntrega;
        tarefa.Prioridade = dto.Prioridade;
        tarefa.Situacao = dto.Situacao;
    }

    private static DateOnly Hoje()
    {
        return DateOnly.FromDateTime(DateTime.Now);
    }
}
