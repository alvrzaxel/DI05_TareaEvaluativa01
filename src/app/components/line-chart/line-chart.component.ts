import { Component, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { Chart, ChartType } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  standalone: false,
})
export class LineChartComponent  implements OnInit {

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
    console.log("Ejecuta ngOnInit en LineChartComponent");
    this.inicializarChart();
  }
  
  // Inicialización del gráfico
  private inicializarChart() {

    // Datos del gráfico
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First dataset',
          data: [10, 25, 40, 35, 50, 65, 80],
          fill: false,
          backgroundColor: this.backgroundColorCategorias[0],
          borderColor: this.borderColorCategorias[0],
          tension: 0.3,
          borderWidth: 1
        },
        {
          label: 'Second dataset',
          data: [80, 65, 50, 55, 40, 30, 20],
          fill: false,
          backgroundColor: this.backgroundColorCategorias[3],
          borderColor: this.borderColorCategorias[3],
          tension: 0.3,
          borderWidth: 1
        },
        {
          label: 'Third dataset',
          data: [30, 45, 60, 50, 70, 55, 75],
          fill: false,
          backgroundColor: this.backgroundColorCategorias[5],
          borderColor: this.borderColorCategorias[5],
          tension: 0.3,
          borderWidth: 1
        }
      ]
    };

    // Creación del elemento <canvas> dinámicamente donde se redenrizará el gráfico
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'lineChart'); // ID única

    // Obtiene el contenedor del gráfico en la plantilla HTML con id "contenedor-linechart"
    const container = this.el.nativeElement.querySelector('#contenedor-linechart');
    this.renderer.appendChild(container, canvas); // Agrega el canvas al contenedor

    // Creación y configuración del gráfico con los datos
    this.chart = new Chart(canvas, {
      type: 'line' as ChartType,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        },
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16,
                weight: 'normal'
              }
            },
          }
        },
      }
    });

    // Tamaño del canvas
    this.chart.canvas.width = 100;
    this.chart.canvas.height = 100;
  }

}
