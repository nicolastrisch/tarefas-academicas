using Microsoft.EntityFrameworkCore;
using TarefasAcademicas.Api.Data;
using TarefasAcademicas.Api.Models;

namespace TarefasAcademicas.Api.Repositories;

public class DisciplinaRepository : IDisciplinaRepository
{
    private readonly AppDbContext _context;

    public DisciplinaRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Disciplina>> ListarPorUsuario(int usuarioId)
    {
        return await _context.Disciplinas
            .Include(d => d.Tarefas)
            .Where(d => d.UsuarioId == usuarioId)
            .OrderBy(d => d.Nome)
            .ToListAsync();
    }

    public async Task<Disciplina?> ObterPorId(int id, int usuarioId)
    {
        return await _context.Disciplinas
            .Include(d => d.Tarefas)
            .FirstOrDefaultAsync(d => d.Id == id && d.UsuarioId == usuarioId);
    }

    public async Task Adicionar(Disciplina disciplina)
    {
        _context.Disciplinas.Add(disciplina);
        await _context.SaveChangesAsync();
    }

    public async Task Atualizar(Disciplina disciplina)
    {
        _context.Disciplinas.Update(disciplina);
        await _context.SaveChangesAsync();
    }

    public async Task Remover(Disciplina disciplina)
    {
        _context.Disciplinas.Remove(disciplina);
        await _context.SaveChangesAsync();
    }
}
