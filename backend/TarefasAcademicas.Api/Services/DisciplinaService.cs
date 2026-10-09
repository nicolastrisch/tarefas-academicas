using TarefasAcademicas.Api.DTOs;
using TarefasAcademicas.Api.Models;
using TarefasAcademicas.Api.Repositories;

namespace TarefasAcademicas.Api.Services;

public class DisciplinaService
{
    private readonly IDisciplinaRepository _disciplinaRepository;

    public DisciplinaService(IDisciplinaRepository disciplinaRepository)
    {
        _disciplinaRepository = disciplinaRepository;
    }

    public async Task<List<DisciplinaDto>> Listar(int usuarioId)
    {
        var disciplinas = await _disciplinaRepository.ListarPorUsuario(usuarioId);
        return disciplinas.Select(ParaDto).ToList();
    }

    public async Task<DisciplinaDto?> ObterPorId(int id, int usuarioId)
    {
        var disciplina = await _disciplinaRepository.ObterPorId(id, usuarioId);
        return disciplina == null ? null : ParaDto(disciplina);
    }

    public async Task<DisciplinaDto> Criar(int usuarioId, SalvarDisciplinaDto dto)
    {
        var disciplina = new Disciplina
        {
            UsuarioId = usuarioId,
            Nome = dto.Nome.Trim(),
            Professor = dto.Professor?.Trim(),
            Semestre = dto.Semestre?.Trim(),
            Cor = dto.Cor
        };

        await _disciplinaRepository.Adicionar(disciplina);
        return ParaDto(disciplina);
    }

    public async Task<DisciplinaDto?> Atualizar(int id, int usuarioId, SalvarDisciplinaDto dto)
    {
        var disciplina = await _disciplinaRepository.ObterPorId(id, usuarioId);
        if (disciplina == null)
            return null;

        disciplina.Nome = dto.Nome.Trim();
        disciplina.Professor = dto.Professor?.Trim();
        disciplina.Semestre = dto.Semestre?.Trim();
        disciplina.Cor = dto.Cor;

        await _disciplinaRepository.Atualizar(disciplina);
        return ParaDto(disciplina);
    }

    public async Task<bool> Excluir(int id, int usuarioId)
    {
        var disciplina = await _disciplinaRepository.ObterPorId(id, usuarioId);
        if (disciplina == null)
            return false;

        if (disciplina.Tarefas.Count > 0)
            throw new InvalidOperationException("Não é possível excluir uma disciplina que possui tarefas.");

        await _disciplinaRepository.Remover(disciplina);
        return true;
    }

    private static DisciplinaDto ParaDto(Disciplina disciplina)
    {
        return new DisciplinaDto
        {
            Id = disciplina.Id,
            Nome = disciplina.Nome,
            Professor = disciplina.Professor,
            Semestre = disciplina.Semestre,
            Cor = disciplina.Cor,
            QuantidadeTarefas = disciplina.Tarefas.Count,
            QuantidadeConcluidas = disciplina.Tarefas.Count(t => t.Situacao == SituacaoTarefa.Concluida)
        };
    }
}
