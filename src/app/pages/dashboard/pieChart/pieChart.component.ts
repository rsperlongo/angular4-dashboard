import { Dashboard } from './../dashboard.component';
import { DashBoardService } from './../../../_services/dashboard.service';
import { GooglechartComponent } from './../googlechart/googlechart.component';
import { Component } from '@angular/core';

//import { PieChartService } from './pieChart.service';

//import 'easy-pie-chart/dist/jquery.easypiechart.js';


@Component({
  selector: 'piechart',
  templateUrl: './pieChart.html',
  styleUrls: ['./pieChart.scss'],
})

export class PieChart {

  public pie_chartData = [
    ['Task', 'Hours per Day'],
    ['Agendamento', 52],
    ['Solicitação - Carteira Identidade', 20],
    ['Emissão - Atestado de Antecedente', 8],
  ];


  public pie_ChartOptions = {
      height: 300,
      chartArea: {
      width: 350,
      height: 300,
      left: 30,

    },
    title: 'Atividades',
          backgroundColor: {
            fill: 'transparent',
          },
          fontSize: 12,
          titleTextStyle: {
            color: 'white',
          },
          legendTextStyle: {
            color: 'white',
          },
          legend: {
            position: 'left',
            maxLines: 1,
          },
          pieSliceBorderColor: '#333',
          
  };

  
}
