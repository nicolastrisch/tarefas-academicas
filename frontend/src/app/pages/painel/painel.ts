import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { Disciplina } from '../../models/disciplina';
import { FiltroTarefa, NOMES_PRIORIDADE, NOMES_SITUACAO, NOMES_TIPO, ResumoTarefas, SituacaoTarefa, Tarefa } from '../../models/tarefa';
import { DisciplinaService } from '../../services/disciplina.service';
import { FiltrosService } from '../../services/filtros.service';
import { TarefaService } from '../../services/tarefa.service';
import { AvisoService } from '../../services/aviso.service';
import { mensagemDeErro } from '../../utils/mensagem-erro';
import { TarefaDialog } from '../../tarefa-dialog/tarefa-dialog';

@Component({
  selector: 'app-painel',
  imports: [DatePipe, FormsModule, RouterLink, MatButtonModule, MatIconModule, MatMenuModule, MatSelectModule, MatFormFieldModule],
  templateUrl: './painel.html',
  styleUrl: './painel.scss'
})
export class Painel implements OnInit {
  private tarefaService = inject(TarefaService);
  private disciplinaService = inject(DisciplinaService);
  private aviso = inject(AvisoService);
  private filtrosService = inject(FiltrosService);
  private dialog = inject(MatDialog);

  tarefas: Tarefa[] = [];
  disciplinas: Disciplina[] = [];
  resumo: ResumoTarefas | null = null;
  carregando = true;

  nomesTipo = NOMES_TIPO;
  nomesPrioridade = NOMES_PRIORIDADE;
  nomesSituacao = NOMES_SITUACAO;

  // o filtro fica no FiltrosService para não se perder ao trocar de tela
  get filtro(): FiltroTarefa {
    return this.filtrosService.painel;
  }

  set filtro(valor: FiltroTarefa) {
    this.filtrosService.painel = valor;
  }

  // usuário novo, ainda sem nenhuma tarefa: mostra os primeiros passos
  get primeiroAcesso(): boolean {
    return this.resumo != null && this.resumo.pendentes + this.resumo.concluidas === 0;
  }

  ngOnInit() {
    this.disciplinaService.listar().subscribe((disciplinas) => (this.disciplinas = disciplinas));
    this.carregar();
  }

  carregar() {
    this.carregando = true;
    this.tarefaService.listar(this.filtro).subscribe((tarefas) => {
      this.tarefas = tarefas;
      this.carregando = false;
    });
    this.tarefaService.resumo().subscribe((resumo) => (this.resumo = resumo));
  }

  // sem tarefa: cadastro; com tarefa: edição
  abrirTarefa(tarefa: Tarefa | null = null) {
    this.dialog
      .open(TarefaDialog, { width: '600px', maxWidth: '95vw', data: { tarefa } })
      .afterClosed()
      .subscribe((salvou) => {
        if (salvou) {
          this.aviso.sucesso('Tarefa salva.');
          this.carregar();
        }
      });
  }

  // os cartões do resumo funcionam como atalho para os filtros
  filtrarPorPrazo(prazo: string) {
    this.filtro = { prazo };
    this.carregar();
  }

  filtrarConcluidas() {
    this.filtro = { situacao: 'Concluida' };
    this.carregar();
  }

  limparFiltros() {
    this.filtro = {};
    this.carregar();
  }

  get mostrandoConcluidas(): boolean {
    return this.filtro.situacao === 'Concluida';
  }

  temFiltro(): boolean {
    return !!(this.filtro.disciplinaId || this.filtro.prioridade || this.filtro.situacao || this.filtro.prazo);
  }

  textoPrazo(tarefa: Tarefa): string {
    if (tarefa.situacao === 'Concluida') return 'Concluída';
    const dias = tarefa.diasRestantes;
    if (dias < 0) return `Atrasada há ${-dias} ${dias === -1 ? 'dia' : 'dias'}`;
    if (dias === 0) return 'Entrega hoje';
    if (dias === 1) return 'Entrega amanhã';
    return `Entrega em ${dias} dias`;
  }

  alterarSituacao(tarefa: Tarefa, situacao: SituacaoTarefa) {
    this.tarefaService.alterarSituacao(tarefa.id, situacao).subscribe({
      next: () => {
        let mensagem = 'Situação alterada.';
        if (situacao === 'Concluida') mensagem = 'Tarefa concluída.';
        if (tarefa.situacao === 'Concluida') mensagem = 'Tarefa reaberta.';
        this.aviso.sucesso(mensagem);
        this.carregar();
      },
      error: (erro: HttpErrorResponse) => this.aviso.erro(mensagemDeErro(erro, 'Erro ao alterar a tarefa.'))
    });
  }

  excluir(tarefa: Tarefa) {
    this.aviso
      .confirmar('Excluir tarefa', `Deseja excluir a tarefa "${tarefa.titulo}"?`)
      .subscribe((confirmou) => {
        if (!confirmou) return;

        this.tarefaService.excluir(tarefa.id).subscribe({
          next: () => {
            this.aviso.sucesso('Tarefa excluída.');
            this.carregar();
          },
          error: (erro: HttpErrorResponse) => this.aviso.erro(mensagemDeErro(erro, 'Erro ao excluir a tarefa.'))
        });
      });
  }
}
