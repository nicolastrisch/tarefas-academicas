import { Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface DadosAviso {
  mensagem: string;
  tipo: 'sucesso' | 'erro';
}

// conteúdo do aviso (toast) mostrado pelo AvisoService
@Component({
  selector: 'app-aviso',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './aviso.html',
  styleUrl: './aviso.scss'
})
export class Aviso {
  dados = inject<DadosAviso>(MAT_SNACK_BAR_DATA);
  private referencia = inject(MatSnackBarRef);

  fechar() {
    this.referencia.dismiss();
  }
}
