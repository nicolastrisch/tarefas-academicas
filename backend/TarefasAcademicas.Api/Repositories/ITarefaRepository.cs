using TarefasAcademicas.Api.Models;

namespace TarefasAcademicas.Api.Repositories;

public interface ITarefaRepository
{
    Task<List<Tarefa>> ListarPorUsuario(int usuarioId);
    Task<Tarefa?> ObterPorId(int id, int usuarioId);
    Task Adicionar(Tarefa tarefa);
    Task Atualizar(Tarefa tarefa);
    Task Remover(Tarefa tarefa);
}
