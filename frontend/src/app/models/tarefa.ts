export type TipoTarefa = 'Prova' | 'Trabalho' | 'Leitura' | 'Forum';
export type Prioridade = 'Baixa' | 'Media' | 'Alta';
export type SituacaoTarefa = 'NaoIniciada' | 'EmAndamento' | 'Concluida';

export interface Tarefa {
  id: number;
  titulo: string;
  descricao: string | null;
  tipo: TipoTarefa;
  dataEntrega: string; // yyyy-MM-dd
  prioridade: Prioridade;
  situacao: SituacaoTarefa;
  disciplinaId: number;
  disciplinaNome: string;
  disciplinaCor: string;
  diasRestantes: number;
  atrasada: boolean;
  prazoProximo: boolean;
}

export interface SalvarTarefa {
  titulo: string;
  descricao: string | null;
  tipo: TipoTarefa;
  dataEntrega: string;
  prioridade: Prioridade;
  situacao: SituacaoTarefa;
  disciplinaId: number;
}

export interface ResumoTarefas {
  pendentes: number;
  atrasadas: number;
  proximosSeteDias: number;
  concluidas: number;
}

export interface FiltroTarefa {
  disciplinaId?: number | null;
  prioridade?: Prioridade | null;
  situacao?: SituacaoTarefa | null;
  prazo?: string | null;
}

export const NOMES_TIPO: Record<TipoTarefa, string> = {
  Prova: 'Prova',
  Trabalho: 'Trabalho',
  Leitura: 'Leitura',
  Forum: 'Fórum'
};

export const NOMES_PRIORIDADE: Record<Prioridade, string> = {
  Baixa: 'Baixa',
  Media: 'Média',
  Alta: 'Alta'
};

export const NOMES_SITUACAO: Record<SituacaoTarefa, string> = {
  NaoIniciada: 'Não iniciada',
  EmAndamento: 'Em andamento',
  Concluida: 'Concluída'
};
