import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { Disciplina } from '../models/disciplina';
import { Prioridade, SalvarTarefa, SituacaoTarefa, Tarefa, TipoTarefa } from '../models/tarefa';
import { DisciplinaService } from '../services/disciplina.service';
import { TarefaService } from '../services/tarefa.service';
import { mensagemDeErro } from '../utils/mensagem-erro';
import { paraDate, paraTextoData } from '../utils/datas';
import { MascaraDataDirective } from '../utils/mascara-data.directive';

export interface DadosTarefaDialog {
  tarefa: Tarefa | null;
  // usado pelo calendário para já sugerir o dia escolhido
  dataInicial?: Date;
}

// modal de cadastro e edição de tarefa, aberto pelo painel e pelo calendário
@Component({
  selector: 'app-tarefa-dialog',
  imports: [
    ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule,
    MatSelectModule, MatDatepickerModule, MatButtonModule, MascaraDataDirective
  ],
  templateUrl: './tarefa-dialog.html',
  styleUrl: './tarefa-dialog.scss'
})
export class TarefaDialog implements OnInit {
  private tarefaService = inject(TarefaService);
  private disciplinaService = inject(DisciplinaService);
  private dialogRef = inject(MatDialogRef<TarefaDialog>);
  private router = inject(Router);
  dados = inject<DadosTarefaDialog>(MAT_DIALOG_DATA);

  disciplinas: Disciplina[] = [];
  carregouDisciplinas = false;
  erro = '';
  salvando = false;

  form = inject(FormBuilder).group({
    titulo: ['', Validators.required],
    descricao: [''],
    tipo: ['Trabalho' as TipoTarefa, Validators.required],
    disciplinaId: [null as number | null, Validators.required],
    dataEntrega: [this.dados.dataInicial ?? (null as Date | null), Validators.required],
    prioridade: ['Media' as Prioridade, Validators.required],
    situacao: ['NaoIniciada' as SituacaoTarefa, Validators.required]
  });

  ngOnInit() {
    this.disciplinaService.listar().subscribe((disciplinas) => {
      this.disciplinas = disciplinas;
      this.carregouDisciplinas = true;
    });

    const tarefa = this.dados.tarefa;
    if (tarefa) {
      this.form.setValue({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao ?? '',
        tipo: tarefa.tipo,
        disciplinaId: tarefa.disciplinaId,
        dataEntrega: paraDate(tarefa.dataEntrega),
        prioridade: tarefa.prioridade,
        situacao: tarefa.situacao
      });
    }
  }

  irParaDisciplinas() {
    this.dialogRef.close();
    this.router.navigate(['/disciplinas']);
  }

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const tarefa: SalvarTarefa = {
      titulo: valores.titulo!,
      descricao: valores.descricao || null,
      tipo: valores.tipo!,
      disciplinaId: valores.disciplinaId!,
      dataEntrega: paraTextoData(valores.dataEntrega!),
      prioridade: valores.prioridade!,
      situacao: valores.situacao!
    };

    this.salvando = true;
    this.erro = '';
    const requisicao = this.dados.tarefa
      ? this.tarefaService.atualizar(this.dados.tarefa.id, tarefa)
      : this.tarefaService.criar(tarefa);

    requisicao.subscribe({
      next: () => this.dialogRef.close(true),
      error: (erro: HttpErrorResponse) => {
        this.erro = mensagemDeErro(erro, 'Erro ao salvar a tarefa.');
        this.salvando = false;
      }
    });
  }
}
