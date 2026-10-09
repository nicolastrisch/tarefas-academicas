import { Component, OnInit, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { CORES_DISCIPLINA, Disciplina } from '../../models/disciplina';
import { DisciplinaService } from '../../services/disciplina.service';
import { AvisoService } from '../../services/aviso.service';
import { mensagemDeErro } from '../../utils/mensagem-erro';
import { DisciplinaDialog } from './disciplina-dialog/disciplina-dialog';

@Component({
  selector: 'app-disciplinas',
  imports: [MatButtonModule, MatIconModule, MatProgressBarModule],
  templateUrl: './disciplinas.html',
  styleUrl: './disciplinas.scss'
})
export class Disciplinas implements OnInit {
  private disciplinaService = inject(DisciplinaService);
  private aviso = inject(AvisoService);
  private dialog = inject(MatDialog);

  disciplinas: Disciplina[] = [];

  ngOnInit() {
    this.carregar();
  }

  carregar() {
    this.disciplinaService.listar().subscribe((disciplinas) => (this.disciplinas = disciplinas));
  }

  // sem disciplina: cadastro; com disciplina: edição
  abrirDialog(disciplina: Disciplina | null = null) {
    const dialogRef = this.dialog.open(DisciplinaDialog, {
      width: '480px',
      maxWidth: '95vw',
      data: { disciplina, corSugerida: this.proximaCor() }
    });

    dialogRef.afterClosed().subscribe((salvou) => {
      if (salvou) {
        this.aviso.sucesso('Disciplina salva.');
        this.carregar();
      }
    });
  }

  // sugere uma cor que ainda não foi usada
  proximaCor(): string {
    const usadas = this.disciplinas.map((d) => d.cor);
    return CORES_DISCIPLINA.find((cor) => !usadas.includes(cor)) ?? CORES_DISCIPLINA[0];
  }

  progresso(disciplina: Disciplina): number {
    if (disciplina.quantidadeTarefas === 0) return 0;
    return Math.round((disciplina.quantidadeConcluidas / disciplina.quantidadeTarefas) * 100);
  }

  excluir(disciplina: Disciplina) {
    this.aviso
      .confirmar('Excluir disciplina', `Deseja excluir a disciplina "${disciplina.nome}"?`)
      .subscribe((confirmou) => {
        if (!confirmou) return;

        this.disciplinaService.excluir(disciplina.id).subscribe({
          next: () => {
            this.aviso.sucesso('Disciplina excluída.');
            this.carregar();
          },
          error: (erro: HttpErrorResponse) =>
            this.aviso.erro(mensagemDeErro(erro, 'Erro ao excluir a disciplina.'))
        });
      });
  }
}
