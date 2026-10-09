using System.ComponentModel.DataAnnotations;

namespace TarefasAcademicas.Api.DTOs;

public class DisciplinaDto
{
    public int Id { get; set; }
    public string Nome { get; set; } = string.Empty;
    public string? Professor { get; set; }
    public string? Semestre { get; set; }
    public string Cor { get; set; } = string.Empty;
    public int QuantidadeTarefas { get; set; }
    public int QuantidadeConcluidas { get; set; }
}

public class SalvarDisciplinaDto
{
    [Required(ErrorMessage = "Informe o nome da disciplina.")]
    [MaxLength(100)]
    public string Nome { get; set; } = string.Empty;

    [MaxLength(100)]
    public string? Professor { get; set; }

    [MaxLength(10)]
    public string? Semestre { get; set; }

    [RegularExpression("^#[0-9a-fA-F]{6}$", ErrorMessage = "Cor inválida.")]
    public string Cor { get; set; } = "#1565c0";
}
