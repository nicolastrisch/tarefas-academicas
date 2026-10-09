import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { NOMES_SITUACAO, Tarefa } from '../../models/tarefa';
import { TarefaService } from '../../services/tarefa.service';
import { FiltrosService } from '../../services/filtros.service';
import { AvisoService } from '../../services/aviso.service';
import { TarefaDialog } from '../../tarefa-dialog/tarefa-dialog';
import { paraDate, paraTextoData } from '../../utils/datas';

interface DiaCalendario {
  numero: number | null;
  data: string; // yyyy-MM-dd
  hoje: boolean;
  tarefas: Tarefa[];
}

@Component({
  selector: 'app-calendario',
  imports: [DatePipe, MatButtonModule, MatIconModule],
  templateUrl: './calendario.html',
  styleUrl: './calendario.scss'
})
export class Calendario implements OnInit {
  private tarefaService = inject(TarefaService);
  private filtrosService = inject(FiltrosService);
  private aviso = inject(AvisoService);
  private dialog = inject(MatDialog);

  dias: DiaCalendario[] = [];
  diaSelecionado: DiaCalendario | null = null;
  disciplinasDoMes: { nome: string; cor: string }[] = [];
  diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  nomesSituacao = NOMES_SITUACAO;

  ngOnInit() {
    this.carregar();
  }

  // o mês fica no FiltrosService para continuar o mesmo ao voltar para o calendário
  get ano(): number {
    return this.filtrosService.anoCalendario;
  }

  set ano(valor: number) {
    this.filtrosService.anoCalendario = valor;
  }

  get mes(): number {
    return this.filtrosService.mesCalendario;
  }

  set mes(valor: number) {
    this.filtrosService.mesCalendario = valor;
  }

  get primeiroDiaDoMes(): Date {
    return new Date(this.ano, this.mes - 1, 1);
  }

  carregar() {
    this.tarefaService.listarDoMes(this.ano, this.mes).subscribe((tarefas) => this.montarCalendario(tarefas));
  }

  mudarMes(quantidade: number) {
    const novaData = new Date(this.ano, this.mes - 1 + quantidade, 1);
    this.ano = novaData.getFullYear();
    this.mes = novaData.getMonth() + 1;
    this.diaSelecionado = null;
    this.carregar();
  }

  irParaHoje() {
    this.ano = new Date().getFullYear();
    this.mes = new Date().getMonth() + 1;
    this.diaSelecionado = null;
    this.carregar();
  }

  selecionar(dia: DiaCalendario) {
    if (dia.numero) {
      this.diaSelecionado = dia;
    }
  }

  abrirTarefa(tarefa: Tarefa | null, dataInicial?: Date) {
    this.dialog
      .open(TarefaDialog, { width: '600px', maxWidth: '95vw', data: { tarefa, dataInicial } })
      .afterClosed()
      .subscribe((salvou) => {
        if (salvou) {
          this.aviso.sucesso('Tarefa salva.');
          this.carregar();
        }
      });
  }

  novaTarefaNoDia() {
    this.abrirTarefa(null, paraDate(this.diaSelecionado!.data));
  }

  private montarCalendario(tarefas: Tarefa[]) {
    const hoje = paraTextoData(new Date());
    const totalDeDias = new Date(this.ano, this.mes, 0).getDate();
    const selecionado = this.diaSelecionado?.data;
    this.dias = [];

    // legenda: cada disciplina que tem tarefa no mês, uma vez só
    this.disciplinasDoMes = [];
    for (const tarefa of tarefas) {
      if (!this.disciplinasDoMes.some((d) => d.nome === tarefa.disciplinaNome)) {
        this.disciplinasDoMes.push({ nome: tarefa.disciplinaNome, cor: tarefa.disciplinaCor });
      }
    }

    // espaços vazios até o dia da semana em que o mês começa
    for (let i = 0; i < this.primeiroDiaDoMes.getDay(); i++) {
      this.dias.push({ numero: null, data: '', hoje: false, tarefas: [] });
    }

    for (let dia = 1; dia <= totalDeDias; dia++) {
      const data = paraTextoData(new Date(this.ano, this.mes - 1, dia));
      this.dias.push({
        numero: dia,
        data,
        hoje: data === hoje,
        tarefas: tarefas.filter((t) => t.dataEntrega === data)
      });
    }

    // mantém o dia que estava selecionado (ou hoje) depois de recarregar
    this.diaSelecionado =
      this.dias.find((d) => d.numero && d.data === selecionado) ?? this.dias.find((d) => d.hoje) ?? null;
  }
}
