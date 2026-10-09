using TarefasAcademicas.Api.Models;

namespace TarefasAcademicas.Api.Repositories;

public interface IDisciplinaRepository
{
    Task<List<Disciplina>> ListarPorUsuario(int usuarioId);
    Task<Disciplina?> ObterPorId(int id, int usuarioId);
    Task Adicionar(Disciplina disciplina);
    Task Atualizar(Disciplina disciplina);
    Task Remover(Disciplina disciplina);
}
