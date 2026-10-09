import { Directive, ElementRef, HostListener, inject } from '@angular/core';

// coloca as barras enquanto o usuário digita a data: 15102026 -> 15/10/2026
@Directive({
  selector: '[appMascaraData]'
})
export class MascaraDataDirective {
  private campo = inject<ElementRef<HTMLInputElement>>(ElementRef);

  @HostListener('input')
  formatar() {
    const numeros = this.campo.nativeElement.value.replace(/\D/g, '').slice(0, 8);
    let texto = numeros;

    if (numeros.length > 4) {
      texto = `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
    } else if (numeros.length > 2) {
      texto = `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    }

    this.campo.nativeElement.value = texto;
  }
}
