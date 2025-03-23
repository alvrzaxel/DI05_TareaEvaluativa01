import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'splitImagePipe',
  standalone: true
})
export class SplitImagePipePipe implements PipeTransform {

  // Divide una imagen en un máximo de 3 partes si su altura supera maxHeight
  transform(image: HTMLCanvasElement, maxHeight: number): HTMLCanvasElement[] {
    const canvasWidth = image.width;
    const canvasHeight = image.height;

    // Si la imagen no excede el máximo, se retorna
    if (canvasHeight <= maxHeight) {
      return [image];
    }

    // Calcula la altura de cada parte
    const partHeight = Math.floor(canvasHeight / 3);
    const images: HTMLCanvasElement[] = [];

    // Genera las tres imágenes recortando la original
    for (let i = 0; i < 3; i++) {
      // Posición de inicio de la imagen original
      const startY = i * partHeight;

      // Canvas para almacenar la imagen
      const partCanvas = document.createElement('canvas');
      const partContext = partCanvas.getContext('2d');

      // Tamaño del canvas
      partCanvas.width = canvasWidth;
      partCanvas.height = partHeight;

      // Dibuja la imagen en el nuevo canvas
      partContext?.drawImage(image, 0, startY, canvasWidth, partHeight, 0, 0, canvasWidth, partHeight);
      images.push(partCanvas);
    }

    // Devuelve el array con las imágenes
    return images;
  }

}
