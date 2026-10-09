import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { Aviso, DadosAviso } from '../aviso/aviso';
import { ConfirmacaoDialog } from '../aviso/confirmacao-dialog';

// mensagens para o usuário: avisos no canto da tela e perguntas de confirmação
@Injectable({ providedIn: 'root' })
export class AvisoService {
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  sucesso(mensagem: string) {
    this.mostrar({ mensagem, tipo: 'sucesso' }, 3000);
  }

  erro(mensagem: string) {
    this.mostrar({ mensagem, tipo: 'erro' }, 5000);
  }

  // devolve true se o usuário confirmou
  confirmar(titulo: string, mensagem: string, botao = 'Excluir'): Observable<boolean> {
    return this.dialog
      .open(ConfirmacaoDialog, { width: '400px', maxWidth: '95vw', data: { titulo, mensagem, botao } })
      .afterClosed();
  }

  private mostrar(dados: DadosAviso, duracao: number) {
    this.snackBar.openFromComponent(Aviso, {
      data: dados,
      duration: duracao,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: dados.tipo === 'sucesso' ? 'aviso-sucesso' : 'aviso-erro'
    });
  }
}
