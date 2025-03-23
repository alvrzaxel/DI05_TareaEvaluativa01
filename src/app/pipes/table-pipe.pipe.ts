import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tablePipe',
  standalone: false
})
export class TablePipePipe implements PipeTransform {

  // Convierte un array en un array de chunks (porciones)
  transform(originalArray: any[], chunkSize: number): any[][] {

    // Verifica que el array y el tamaño del chunk sea válido
    if (!originalArray || !Array.isArray(originalArray) || chunkSize <= 0) {
      return [];
    }

    // Array para almacenar los chunks
    const chunkedArray = [];

    // Itera a través del array original y lo divide en chunks
    let currentIndex = 0;
    while (currentIndex < originalArray.length) {
      if (currentIndex + chunkSize >= originalArray.length) {

        // Si el resto de los elementos es menor que el tamaño del chunk, crea el último chunk con lo que queda
        chunkedArray.push(originalArray.slice(currentIndex));
      } else {

        // Si hay suficientes elementos para completar el chunk, lo agrega al array de chunks
        chunkedArray.push(originalArray.slice(currentIndex, currentIndex + chunkSize));
      }

      // Avanza el índice para la siguiente iteración
      currentIndex += chunkSize;
    }
    return chunkedArray;
  }
}
