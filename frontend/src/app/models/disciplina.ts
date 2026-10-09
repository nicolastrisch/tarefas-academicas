export interface Disciplina {
  id: number;
  nome: string;
  professor: string | null;
  semestre: string | null;
  cor: string;
  quantidadeTarefas: number;
  quantidadeConcluidas: number;
}

export interface SalvarDisciplina {
  nome: string;
  professor: string | null;
  semestre: string | null;
  cor: string;
}

// sem vermelho, porque o vermelho indica tarefa atrasada
export const CORES_DISCIPLINA = ['#1565c0', '#2e7d32', '#6a1b9a', '#ef6c00', '#00838f', '#ad1457', '#5d4037', '#3949ab'];
