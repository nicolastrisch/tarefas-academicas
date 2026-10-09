using Microsoft.EntityFrameworkCore;
using TarefasAcademicas.Api.Models;

namespace TarefasAcademicas.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; }
    public DbSet<Disciplina> Disciplinas { get; set; }
    public DbSet<Tarefa> Tarefas { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Usuario>(e =>
        {
            e.ToTable("usuario");
            e.Property(u => u.Nome).HasMaxLength(100).IsRequired();
            e.Property(u => u.Email).HasMaxLength(150).IsRequired();
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Disciplina>(e =>
        {
            e.ToTable("disciplina");
            e.Property(d => d.Nome).HasMaxLength(100).IsRequired();
            e.Property(d => d.Professor).HasMaxLength(100);
            e.Property(d => d.Semestre).HasMaxLength(10);
            e.Property(d => d.Cor).HasMaxLength(7).IsRequired().HasDefaultValue("#1565c0");
            e.HasOne(d => d.Usuario)
                .WithMany(u => u.Disciplinas)
                .HasForeignKey(d => d.UsuarioId);
        });

        modelBuilder.Entity<Tarefa>(e =>
        {
            e.ToTable("tarefa");
            e.Property(t => t.Titulo).HasMaxLength(150).IsRequired();
            e.Property(t => t.Descricao).HasMaxLength(1000);
            // disciplina com tarefas não pode ser excluída (regra no DisciplinaService)
            e.HasOne(t => t.Disciplina)
                .WithMany(d => d.Tarefas)
                .HasForeignKey(t => t.DisciplinaId)
                .OnDelete(DeleteBehavior.Restrict);
        });
    }
}
