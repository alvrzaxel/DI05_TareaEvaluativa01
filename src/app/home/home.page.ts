import { Component, ElementRef, ViewChild } from '@angular/core';
import { GestionApiService } from '../services/gestion-api/gestion-api.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SplitImagePipePipe } from '../pipes/split-image-pipe.pipe';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  
  // Categorías para la llamada a la API
  categorias: string[] = ["business", "entertainment", "general", "technology", "health", "science", "sports"];

  // Datos de la tabla
  dataTable: { nombre: string, apellido: string, pais: string, edad: number }[] = [];;

  // Datos de la lista
  dataList: string[] = []

  // Referencia al contenenor para generar el PDF
  @ViewChild('container') container!: ElementRef;

  constructor(private gestionApi: GestionApiService) {}

  ngOnInit() {
    // Incializa los datos de la tabla y la lista
    this.initData();

    // Llamada a la API
    this.llamadaAPI();
  }

  // Método para llamar a la API una vez por cada categoría
  private llamadaAPI() {
    this.categorias.forEach(categoria => {
      this.gestionApi.cargarCategoria(categoria);
    });
  }

  // Método para generar un archivo PDF
  async createPDF() {
    
    // Verifica si el contenedor está disponible
    if (!this.container) {
      console.error("El contenedor no está disponible.");
      return;
    }

    // Tamaño de una págins A4 en píxeles
    const anchoMax = 794;
    const altoMax = 1123;

    // Documento PDF con orientación vertical
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [anchoMax, altoMax]
    });

    // Selecciona todas las secciones del HTML con la clase "section"
    const sections = this.container.nativeElement.querySelectorAll('.section') as NodeListOf<HTMLElement>;

    // Verifica si hay secciones para tratar
    if (sections.length === 0) {
      console.error("Las secciones no están disponibles.");
      return;
    }

    // Espacios reservados para encabezado y pie de página
    let headerHeight = 55;
    let footerHeight = 10;
    let reservedSpace = headerHeight + footerHeight;

    // Posición inicial para dibujar el contenido en la página
    let yPos = headerHeight + 5; // Posición inicial en la página

    // Tamaño del documento
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // NodeList a array para iteración
    const sectionsArray = Array.from(sections);
    for (const section of sectionsArray) {

      // Convierte la sección HTML en un imagen de canvas
      await html2canvas(section).then(canvas => {

        // Array para almacenar las imágenes
        let images: HTMLCanvasElement[] = [];

        // Comprueba si la sección tiene elementos "chart" para manear los tres gráficos
        const childsChart = section.querySelectorAll('.chart') as NodeListOf<HTMLElement>;
        if (childsChart.length > 0 ) {

          // Procesa los gráficos con un pipe para dividir la imagen si es necesario
          images = new SplitImagePipePipe().transform(canvas, pageHeight - reservedSpace - yPos);
        } else {

          // Almacena la imagen si no hay que dividirla
          images.push(canvas);
        }
          
        // Itera por cada imagen
        for (const image of images) {
          
          // Convierte cada parte de la imagen en formato base64
          const imageData = image.toDataURL('image/jpg');

          // Ajusta el tamaño de la imagen para encajar en la página
          let imgWidth = pageWidth - 10;
          let imgHeight = image.height * (pageWidth / canvas.width);

          // Crea una nueva página si la imagen no cabe en la actual
          if (yPos + imgHeight > pageHeight - reservedSpace) {
            doc.addPage();
            yPos = headerHeight;
          }

          // Agrega la imagen al PDF
          doc.addImage(imageData, 'JPG', 0, yPos, imgWidth, imgHeight);
          yPos += imgHeight; // Actualiza la posición para la siguiente imagen
        }
      });
    }

    // Agrega el encabezado y pie de página
    this.addPageConfig(doc);

    // Guardar el documento PDF
    doc.save('dashboard.pdf');
  }

  // Método para configurar encabezado y pie de página en cada página
  addPageConfig(doc: jsPDF) {

    // Obtiene las medidas de la página
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Margen para los rectángulo y tamaño de la fuente
    const rectPadding = 10;
    const fontSize = 11;

    // Color fondo encabezado y pié de página
    const rectColor = '#CCCCCC';

    // Iteramos cada página del documento
    for (let i = 1; i <= doc.getNumberOfPages(); i++) {

      // Establece la página a modificar y el tamaño de la fuente
      doc.setPage(i);
      doc.setFontSize(fontSize);

      // Agrega encabezado y pie de página a cada página
      this.headerConfig(doc, rectColor, rectPadding, pageWidth);
      this.footerConfig(doc, rectColor, rectPadding, pageWidth, pageHeight, i);
    }
  }

  // Configurar el encabezado en el PDF
  private headerConfig(doc: jsPDF, rectColor: string, rectPadding: number, pageWidth: number) {
    
    // Imagen del logotipo
    const imagen = "/assets/icon/favicon.png";
    const imgWidth = 45;
    const imgHeight = 45;

    // Datos de la empresa
    const nombreEmpresa = "Nombre de la Empresa";
    const telefono = "Teléfono: 123-456-789";
    const direccion = "Dirección: Calle Principal, 123";
    const textoEmpresa = `${nombreEmpresa}\n${telefono}\n${direccion}`;

    // Establece el color de fondo
    doc.setFillColor(rectColor);

    // Dibuja el rectángulo de fondo en el encabezado
    doc.rect(rectPadding, rectPadding - 5, pageWidth - 20, imgWidth, 'F');

    // Agrega la información de la empresa en el encabezado
    doc.text(textoEmpresa, (rectPadding * 2), rectPadding, { baseline: 'top' });

    // Inserta el logotipo en el centro del encabezado
    doc.addImage(imagen, "JPG", (pageWidth / 2) - (imgWidth / 2), 5, imgWidth, imgHeight);

    // Dibuja una línea divisoria debajo del encabezado
    doc.line(0, 55, pageWidth, 55);
  }

  // Configurar el pie de página en el PDF
  private footerConfig(doc: jsPDF, rectColor: string, rectPadding: number, pageWidth: number, pageHeight: number, currentPage: number) {

    // Establece el color de fondo
    doc.setFillColor(rectColor);

    // Dibuja el rectángulo de fondo en el pie de página
    doc.rect(rectPadding, pageHeight - (rectPadding * 2), pageWidth - (rectPadding * 2), rectPadding, 'F');

    // Agrega el número de página al pie de página
    doc.text(`Página ${currentPage} de ${doc.getNumberOfPages()}`, (pageWidth / 2) - (rectPadding * 2), pageHeight - rectPadding, { baseline: 'bottom' });
  }

  // Método para incicializar los datos de la tabla y lista
  private initData() {

    // Rellena la tabla
    for (let i = 0; i < 6; i++) {
      this.dataTable.push(
        { nombre: 'Juan', apellido: 'garcia', pais: "españa", edad: 30 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'María', apellido: 'perez', pais: "portugal", edad: 25 },
        { nombre: 'Pedro', apellido: 'ruiz', pais: "españa", edad: 40 },
      );
    }

    // Rellena la lista
    this.dataList = [
      "Esta será la línea 1 de la lista, vamos a poner un texto muy largo para ver qué es lo que hace en estos casos y como podemos corregirlo.",
      "Esta será la línea 2 de la lista, será más corta que la anterior, pero entrará bastante justo en el ancho A4."
    ];

    // Rellena el resto de las líneas en la lista
    for (let i = 3; i <= 50; i++) {
      this.dataList.push(`Esta será la línea ${i} de la lista, esta entra bien.`);
    }
  }

}
