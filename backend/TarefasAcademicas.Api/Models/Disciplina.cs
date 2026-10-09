namespace TarefasAcademicas.Api.Models;

public class Disciplina
{
    public int Id { get; set; }
    public int UsuarioId { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Professor { get; set; }
    public string? Semestre { get; set; }
    public string Cor { get; set; } = "#1565c0";

    public Usuario? Usuario { get; set; }
    public List<Tarefa> Tarefas { get; set; } = new();
}
