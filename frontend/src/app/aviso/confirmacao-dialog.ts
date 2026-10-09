import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DadosConfirmacao {
  titulo: string;
  mensagem: string;
  botao: string;
}

// pergunta de confirmação antes de ações que não dá para desfazer, como excluir
@Component({
  selector: 'app-confirmacao-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title><mat-icon>warning</mat-icon>{{ dados.titulo }}</h2>
    <mat-dialog-content>{{ dados.mensagem }}</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">Cancelar</button>
      <button mat-flat-button class="perigo" [mat-dialog-close]="true" cdkFocusInitial>{{ dados.botao }}</button>
    </mat-dialog-actions>
  `,
  styles: `
    h2 {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    h2 mat-icon {
      color: #c62828;
    }

    .perigo {
      --mat-button-filled-container-color: #c62828;
    }
  `
})
export class ConfirmacaoDialog {
  dados = inject<DadosConfirmacao>(MAT_DIALOG_DATA);
}
