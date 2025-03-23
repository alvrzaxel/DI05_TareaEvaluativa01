import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss'],
  standalone: false,
})
export class ListsComponent  implements OnInit {

  // Recibe los datos desde el componente padre
  @Input() dataList: any[] = [];

  constructor() { }

  ngOnInit() {}

}
