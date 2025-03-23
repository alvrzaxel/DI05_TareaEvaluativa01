import { ListsComponent } from './lists/lists.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';
import { TablesComponent } from './tables/tables.component';
import { TablePipePipe } from '../pipes/table-pipe.pipe';



@NgModule({
  declarations: [
    BarChartComponent, LineChartComponent, PieChartComponent, TablesComponent, ListsComponent, TablePipePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BarChartComponent, LineChartComponent, PieChartComponent, ListsComponent, TablesComponent
  ]
})
export class MymoduleModule { }
