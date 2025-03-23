import { Component, ElementRef, Input, input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
  standalone: false,
})
export class PieChartComponent  implements OnInit {

  // Propiedad que almacenará la instancia del gráfico
  public chart!: Chart;

  // Arrays para personalizar los colores del gráfico
  backgroundColorCategorias: string[] = ['rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)', 'rgba(255, 205, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(201, 203, 207, 0.2)'];
  borderColorCategorias: string[] = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)', 'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];

  constructor(
    private el: ElementRef, // Permite acceder a elementos del DOM dentro del componente
    private renderer: Renderer2, // Permite manipular el DOM de forma segura con Angular
  ) { }

  ngOnInit(): void {
    console.log("Ejecuta ngOnInit en PieChartComponent");
    this.inicializarChart();
  }

  // Inicialización del gráfico
  private inicializarChart() {
    const data = {
      labels: [
        'Red',
        'Orange',
        'Yellow',
        'Green',
        'Blue',
        'Purple',
        'Gray'
      ],
      datasets: [{
        label: 'Mi Dataset',
        data: [10, 12, 8, 10, 20, 15, 25],
        backgroundColor: [
          this.backgroundColorCategorias[0],
          this.backgroundColorCategorias[1],
          this.backgroundColorCategorias[2],
          this.backgroundColorCategorias[3],
          this.backgroundColorCategorias[4],
          this.backgroundColorCategorias[5],
          this.backgroundColorCategorias[6]
        ],
        borderColor: [
          this.borderColorCategorias[0],
          this.borderColorCategorias[1],
          this.borderColorCategorias[2],
          this.borderColorCategorias[3],
          this.borderColorCategorias[4],
          this.borderColorCategorias[5],
          this.borderColorCategorias[6]
        ],
        borderWidth: 1,
        hoverOffset: 20
      }]
    }

    // Creación del elemento <canvas> dinámicamente donde se redenrizará el gráfico
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'pieChart'); // ID única

    // Obtiene el contenedor del gráfico en la plantilla HTML con id "contenedor-piechart"
    const container = this.el.nativeElement.querySelector('#contenedor-piechart');
    this.renderer.appendChild(container, canvas); // Agrega el canvas al contenedor

    // Creación y configuración del gráfico
    this.chart = new Chart(canvas, {
      type: 'pie' as ChartType,
      data: data,
    });

    // Tamaño del canvas
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

}
