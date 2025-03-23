import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss'],
  standalone: false,
})
export class TablesComponent implements OnInit {

  // Recibe los datos desde el componente padre
  @Input() datosTabla: any[] = [];

  constructor() { }

  ngOnInit() {}

}
