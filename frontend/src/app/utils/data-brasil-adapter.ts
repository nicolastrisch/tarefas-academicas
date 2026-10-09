import { Injectable } from '@angular/core';
import { NativeDateAdapter } from '@angular/material/core';

// o NativeDateAdapter lê datas digitadas no formato americano (MM/dd/yyyy),
// então "15/10/2026" ficava inválido. Aqui a data digitada é lida como dd/MM/yyyy.
// Também aceita só os números (15102026), caso a data seja colada sem as barras.
@Injectable()
export class DataBrasilAdapter extends NativeDateAdapter {
  override parse(valor: unknown): Date | null {
    if (typeof valor === 'string' && /^\d{8}$/.test(valor)) {
      valor = `${valor.slice(0, 2)}/${valor.slice(2, 4)}/${valor.slice(4)}`;
    }

    if (typeof valor === 'string' && valor.includes('/')) {
      const [dia, mes, ano] = valor.split('/').map(Number);
      const data = new Date(ano, mes - 1, dia);

      if (data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia) {
        return data;
      }
      return this.invalid();
    }
    return super.parse(valor);
  }
}
