using Microsoft.EntityFrameworkCore;
using TarefasAcademicas.Api.Data;
using TarefasAcademicas.Api.Models;

namespace TarefasAcademicas.Api.Repositories;

public class TarefaRepository : ITarefaRepository
{
    private readonly AppDbContext _context;

    public TarefaRepository(AppDbContext context)
    {
        _context = context;
    }

    // a tarefa pertence ao usuário pela disciplina
    public async Task<List<Tarefa>> ListarPorUsuario(int usuarioId)
    {
        return await _context.Tarefas
            .Include(t => t.Disciplina)
            .Where(t => t.Disciplina!.UsuarioId == usuarioId)
            .ToListAsync();
    }

    public async Task<Tarefa?> ObterPorId(int id, int usuarioId)
    {
        return await _context.Tarefas
            .Include(t => t.Disciplina)
            .FirstOrDefaultAsync(t => t.Id == id && t.Disciplina!.UsuarioId == usuarioId);
    }

    public async Task Adicionar(Tarefa tarefa)
    {
        _context.Tarefas.Add(tarefa);
        await _context.SaveChangesAsync();
    }

    public async Task Atualizar(Tarefa tarefa)
    {
        _context.Tarefas.Update(tarefa);
        await _context.SaveChangesAsync();
    }

    public async Task Remover(Tarefa tarefa)
    {
        _context.Tarefas.Remove(tarefa);
        await _context.SaveChangesAsync();
    }
}
