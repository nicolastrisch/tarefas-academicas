namespace TarefasAcademicas.Api.Models;

public class Tarefa
{
    public int Id { get; set; }
    public int DisciplinaId { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public TipoTarefa Tipo { get; set; }
    public DateOnly DataEntrega { get; set; }
    public Prioridade Prioridade { get; set; }
    public SituacaoTarefa Situacao { get; set; }

    public Disciplina? Disciplina { get; set; }
}
