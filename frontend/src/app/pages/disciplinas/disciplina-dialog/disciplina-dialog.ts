import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CORES_DISCIPLINA, Disciplina } from '../../../models/disciplina';
import { DisciplinaService } from '../../../services/disciplina.service';
import { mensagemDeErro } from '../../../utils/mensagem-erro';

export interface DadosDisciplinaDialog {
  disciplina: Disciplina | null;
  corSugerida: string;
}

// modal de cadastro e edição de disciplina
@Component({
  selector: 'app-disciplina-dialog',
  imports: [ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './disciplina-dialog.html',
  styleUrl: './disciplina-dialog.scss'
})
export class DisciplinaDialog {
  private disciplinaService = inject(DisciplinaService);
  private dialogRef = inject(MatDialogRef<DisciplinaDialog>);
  dados = inject<DadosDisciplinaDialog>(MAT_DIALOG_DATA);

  cores = CORES_DISCIPLINA;
  erro = '';
  salvando = false;

  form = inject(FormBuilder).nonNullable.group({
    nome: [this.dados.disciplina?.nome ?? '', Validators.required],
    professor: [this.dados.disciplina?.professor ?? ''],
    semestre: [this.dados.disciplina?.semestre ?? ''],
    cor: [this.dados.disciplina?.cor ?? this.dados.corSugerida]
  });

  salvar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const disciplina = {
      nome: valores.nome,
      professor: valores.professor || null,
      semestre: valores.semestre || null,
      cor: valores.cor
    };

    this.salvando = true;
    this.erro = '';
    const requisicao = this.dados.disciplina
      ? this.disciplinaService.atualizar(this.dados.disciplina.id, disciplina)
      : this.disciplinaService.criar(disciplina);

    requisicao.subscribe({
      next: () => this.dialogRef.close(true),
      error: (erro: HttpErrorResponse) => {
        this.erro = mensagemDeErro(erro, 'Erro ao salvar a disciplina.');
        this.salvando = false;
      }
    });
  }
}
