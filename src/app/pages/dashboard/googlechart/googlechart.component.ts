import { Dashboard } from './../dashboard.component';
import { DashBoardService } from './../../../_services/dashboard.service';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';


declare var google: any;
declare var googleLoaded: any;
@Directive({
  selector: '[GoogleChart]'
})
export class GooglechartComponent implements OnInit {
  public _element: any;
  @Input('chartType') public chartType: string;
  @Input('chartOptions') public chartOptions: Object;
  @Input('chartData') public chartData: Object;

  constructor(public element: ElementRef) {
    this._element = this.element.nativeElement;
    
  }
  ngOnInit() {

    setTimeout(() => {
      google.charts.load('current', { 'packages': ['corechart'] });
        setTimeout(() => {
          setInterval(() => {
            this.drawGraph(this.chartOptions, this.chartType, this.chartData, this._element); 
          }, 5000);
        }, 1000);
      }, 1000);
  }
   drawGraph (chartOptions, chartType, chartData, ele) {
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
      let wrapper;
      wrapper = new google.visualization.ChartWrapper({
        chartType: chartType,
        dataTable: chartData ,
        options: chartOptions || {},
        containerId: ele.id,
      });
      wrapper.draw();
    }
  }
}
 /* drawGraph (chartOptions, chartType, chartData, ele) {
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {

      if (ele.id.toString() === 'pie_chart') {

        var currentDate = new Date();
        var day = currentDate.getDate();
        var month = currentDate.getMonth() + 1;
        var year = currentDate.getFullYear();
        var currentFormatDate = '';
        currentFormatDate = currentFormatDate.concat(year.toString(), '-', month.toString(), '-', day.toString());

        var urlApi = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/';
        var tipoServico = 'volumetria/';
        var dataInicioFormatado = '';
        var dataFimFormatado = '';
        var dataInicio = new Date(dataInicioFormatado.concat(currentFormatDate, ' 00:00:00.000')).valueOf().toString();
        var dataFim = new Date(dataFimFormatado.concat(currentFormatDate, ' 23:59:59.000')).valueOf().toString();
        var urlCompletaFormatada = '';
        var urlCompleta = urlCompletaFormatada.concat(urlApi, tipoServico, 'inicio/', dataInicio, '/fim/', dataFim);

      $.ajax({
        type: 'GET',
        contentType : 'application/json',
        dataType: 'json',
        url: urlCompleta,
        beforeSend: function(request) {
          request.setRequestHeader('Authorization', 'bearer ' + localStorage.getItem('Current user').replace(/['"]+/g, ''));
        },
        success: function (data) {

          var total = parseInt('0');
          var agendamento = parseInt('0');
          var solicitacaoCarteira = parseInt('0');
          var EmissaoAtestado = parseInt('0');

          if (data !== null && data !== '') {
            $(data).each( function() {
              total += this.DocCount;
              if( this.Key === 'Agendamento')
                agendamento = this.DocCount;
              if( this.Key === 'Solicitação - Carteira de identidade')
                solicitacaoCarteira = this.DocCount;
              if( this.Key === 'Emissão - Atestado de antecedentes')
                EmissaoAtestado = this.DocCount;
            });

              chartData = [['Task', 'Hours per Day'],
                          ['Agendamento', agendamento],
                          ['Solicitação - Carteira Identidade', solicitacaoCarteira],
                          ['Emissão - Atestado de Antecedente', EmissaoAtestado]];

              var wrapper;
              wrapper = new google.visualization.ChartWrapper({
                chartType: chartType,
                dataTable: chartData ,
                options: chartOptions || {},
                containerId: ele.id,
              });
              wrapper.draw();
          }
        },
        error: function (error) {
          console.log('ERRO: ' + JSON.stringify(error));
          // var body = {
          //             grant_type: 'password',
          //             client_id: 'totem.dashboard.web',
          //             client_secret: '1dc3ddc9-18e9-40d4-ad13-6dc5c95760f6',
          //             username: '44444444444',
          //             password: 'prodesp',
          //             scope: 'openid profile offline_access Dashboard.Search',
          //           };

          // $.ajax({
          //   url: 'http://desenv.autenticador.sp.gov.br/connect/token',
          //   type: 'POST',
          //   dataType: 'json',
          //   contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
          //   data: body,
          //   success: function(result) {
          //     var token = JSON.stringify(result.access_token);
          //     localStorage.setItem('Current user', token);
          //   },
          //   error: function(result) {
          //     console.log(JSON.stringify(result));
          //   },
          // });
        },
      });



      } else {
        var wrapper;
        wrapper = new google.visualization.ChartWrapper({
          chartType: chartType,
          dataTable: chartData ,
          options: chartOptions || {},
          containerId: ele.id,
        });
        wrapper.draw();
      }
    }
  }
}*/

