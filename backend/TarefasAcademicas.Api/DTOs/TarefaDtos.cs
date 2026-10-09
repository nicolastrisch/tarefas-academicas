using System.ComponentModel.DataAnnotations;
using TarefasAcademicas.Api.Models;

namespace TarefasAcademicas.Api.DTOs;

public class TarefaDto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string? Descricao { get; set; }
    public TipoTarefa Tipo { get; set; }
    public DateOnly DataEntrega { get; set; }
    public Prioridade Prioridade { get; set; }
    public SituacaoTarefa Situacao { get; set; }
    public int DisciplinaId { get; set; }
    public string DisciplinaNome { get; set; } = string.Empty;
    public string DisciplinaCor { get; set; } = string.Empty;
    public int DiasRestantes { get; set; }
    public bool Atrasada { get; set; }
    public bool PrazoProximo { get; set; }
}

public class SalvarTarefaDto
{
    [Required(ErrorMessage = "Informe o título.")]
    [MaxLength(150)]
    public string Titulo { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Descricao { get; set; }

    [Required]
    public TipoTarefa Tipo { get; set; }

    [Required(ErrorMessage = "Informe a data de entrega.")]
    public DateOnly DataEntrega { get; set; }

    [Required]
    public Prioridade Prioridade { get; set; }

    public SituacaoTarefa Situacao { get; set; } = SituacaoTarefa.NaoIniciada;

    [Range(1, int.MaxValue, ErrorMessage = "Selecione a disciplina.")]
    public int DisciplinaId { get; set; }
}

public class AlterarSituacaoDto
{
    [Required]
    public SituacaoTarefa Situacao { get; set; }
}

public class ResumoTarefasDto
{
    public int Pendentes { get; set; }
    public int Atrasadas { get; set; }
    public int ProximosSeteDias { get; set; }
    public int Concluidas { get; set; }
}

public class FiltroTarefaDto
{
    public int? DisciplinaId { get; set; }
    public Prioridade? Prioridade { get; set; }
    public SituacaoTarefa? Situacao { get; set; }
    // "atrasadas", "7dias" ou "30dias"
    public string? Prazo { get; set; }
}
