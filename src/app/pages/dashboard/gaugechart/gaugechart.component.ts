import { GooglechartComponent } from './../googlechart/googlechart.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gaugechart',
  templateUrl: './gaugechart.component.html',
  styleUrls: ['./gaugechart.component.scss'],
})

export class GaugechartComponent implements OnInit {


  public gauge_ChartData = [
        ['Label', 'Value'],
        ['Satisfação', 87]];

  public gauge_ChartOptions = {
        width: 500, height: 260,
        redFrom: 0, redTo: 33,
        yellowFrom: 33, yellowTo: 66,
        greenFrom: 66, greenTo: 100,
        minorTicks: 5,
  };

  constructor() { }

  ngOnInit() {

  /*  var token = '';

    authenticateUser();

    function executaServicos() {
      
      setInterval(function() 
      {
        satisfacao();
      }, 5000);
    }

    // Buscar o token
    function authenticateUser() {
      var body = {
        grant_type: 'password',
        client_id: 'totem.dashboard.web',
        client_secret: '1dc3ddc9-18e9-40d4-ad13-6dc5c95760f6',
        username: '44444444444',
        password: 'prodesp',
        scope: 'openid profile offline_access Dashboard.Search',
      };

      $.ajax({
        url: 'http://desenv.autenticador.sp.gov.br/connect/token',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        data: body,
        success: function(result) {
          token += JSON.stringify(result.access_token);
          executaServicos();
        },
        error: function(result) {
          console.log(JSON.stringify(result));
        },
      });
    }

    function satisfacao() {

      var currentDate = new Date();
      var day = currentDate.getDate();
      var month = currentDate.getMonth() + 1;
      var year = currentDate.getFullYear();
      var currentFormatDate = '';
      currentFormatDate = currentFormatDate.concat(year.toString(), '-', month.toString(), '-', day.toString());

      var urlApi = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/';
      var tipoServico = 'satisfacao/';
      var dataInicioFormatado = '';
      var dataFimFormatado = '';
      var dataInicio = new Date(dataInicioFormatado.concat(currentFormatDate, ' 00:00:00.000')).valueOf().toString();
      var dataFim = new Date(dataFimFormatado.concat(currentFormatDate, ' 23:59:59.000')).valueOf().toString();
      var urlCompletaFormatada = '';
      var urlCompleta = urlCompletaFormatada.concat(urlApi, tipoServico, 'inicio/', dataInicio, '/fim/', dataFim);

      var headerParam = 'bearer ' + token.replace(/['"]+/g, '');

      $.ajax({
        type: 'GET',
        contentType : 'application/json',
        dataType: 'json',
        url: urlCompleta,
        beforeSend: function(request) {
          request.setRequestHeader('Authorization', headerParam);
        },
        success: function (data) {
          if (data !== null && data !== '') {

            var contadorTotal = parseInt('0');
            var contadorSatisfacao = parseInt('0');
            var resultado = parseInt('0');

            $(data).each( function() {
              if( this.Key === 'ÓTIMO' || this.Key === 'BOM'){
                contadorSatisfacao += this.DocCount;
              }
              contadorTotal += this.DocCount;              
            });

            resultado = (contadorSatisfacao * 100) / contadorTotal;

            // var data = google.visualization.arrayToDataTable([['Label', 'Value'],['Satisfação', resultado]]);

            // var options = {
            //   width: 400, height: 120,
            //   redFrom: 90, redTo: 100,
            //   yellowFrom:75, yellowTo: 90,
            //   minorTicks: 5
            // };
            
            // var chart = new google.visualization.Gauge(document.getElementById('chart_div'));

            // chart.draw(data, options);

            // setInterval(function() {
            //   data.setValue(0, 1, 40 + Math.round(60 * Math.random()));
            //   chart.draw(data, options);
            // }, 13000);

            
          }
        },
        error: function (error) {
          console.log('ERRO: ' + JSON.stringify(error));
          authenticateUser();
        },
      });
    } */
  }
}
