using TarefasAcademicas.Api.Models;

namespace TarefasAcademicas.Api.Repositories;

public interface IUsuarioRepository
{
    Task<Usuario?> ObterPorEmail(string email);
    Task Adicionar(Usuario usuario);
}
