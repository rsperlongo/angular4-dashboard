import { RetornoServicos } from './../../_models/servicos.model';
import { RetornoTempoMedioAtendimento } from './../../_models/tempo-medio-atendimento.models';
import { RetornoDare } from './../../_models/emissao-dare.models';
import { User } from './../../_models/user';
import { UserService } from './../../_services/index';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, URLSearchParams, Response } from '@angular/http';
import { RetornoLogin } from './../../_models/login.model';
import { DashBoardService } from './../../_services/dashboard.service';
import { AuthenticationService } from './../../_services/authentication.service';
import { RetornoAtendimento } from './../../_models/dashboard.model';
import { RetornoPinpad } from './../../_models/pagamento.model';
import * as moment from 'moment';
import { SimpleTimer } from 'ng2-simple-timer';

@Component({
  moduleId: module.id,
  selector: 'dashboard',
  styleUrls: ['./dashboard.scss'],
  templateUrl: './dashboard.component.html',
})

export class Dashboard implements OnInit, OnDestroy {
  private inicio: number;
  private fim: number;
  private tk: string;
  counter: number = 0;
  public totalAtendimento: number;
  public totalPagamentos: number;
  public totalEmissaoDare: number;
  public totalAgendamento: number;
  public totalAgendamento1: number;
  public totalAgendamento2: number;
  public totalAgendamento3: number;
  public agendamento1: string;
  public agendamento2: string;
  public agendamento3: string;
  public totalTempoMedioAtendimento: string;
  public Value: any;
  public servicos1: string;
  public servicos2: string;
  public totalServicos1: number;
  public totalServicos2: number;
  constructor(private router: Router,
    private dashBoardService: DashBoardService,
    private authenticationService: AuthenticationService,
    private st: SimpleTimer) { }
  ngOnDestroy() {
    this.st.delTimer('5sec');
  }
  retornoTotalAtendimento(retorno: string) {
    const ret: string = JSON.stringify(retorno);
    const retAtend: RetornoAtendimento[] = JSON.parse(ret);
    const arr = new Array();
    
    if (retAtend.length !== 0 ) {
    this.totalAtendimento = retAtend[0].DocCount;
    } else {
       this.totalAtendimento = 0;
    }

  }
  retornoTotalPagamentos(retorno: string) {
    
    const ret: string = JSON.stringify(retorno);
    const retPin: RetornoPinpad = JSON.parse(ret);
    this.totalPagamentos = retPin.count;
  }

  retornoTotalDare(retorno: string) {
    const ret: string = JSON.stringify(retorno);
    const retDare: RetornoDare = JSON.parse(ret);
    this.totalEmissaoDare = retDare.count;


  }

  retornoTotalAgendamento(retorno: string) {

    const ret: string = JSON.stringify(retorno);
    const arr: RetornoAtendimento[] = JSON.parse(ret);
    let totAgend = 0;
    if (arr.length !== 0) {
      for (let _i = 0; _i < arr.length; _i++) {

        const item: RetornoAtendimento = arr[_i];

        totAgend += item.DocCount;
      }
      this.agendamento1 = 'AGENDAMENTO - ' + arr[0].Key;
      this.totalAgendamento1 = arr[0].DocCount;
      this.agendamento2 = 'AGENDAMENTO - ' + arr[1].Key;
      this.totalAgendamento2 = arr[1].DocCount;
      this.agendamento3 = 'AGENDAMENTO - ' + arr[2].Key;
      this.totalAgendamento3 = arr[2].DocCount;
    } else {
      this.agendamento1 = 'AGENDAMENTO - ';
      this.totalAgendamento1 = 0;
      this.agendamento2 = 'AGENDAMENTO - ';
      this.totalAgendamento2 = 0;
      this.agendamento3 = 'AGENDAMENTO - ';
      this.totalAgendamento3 = 0;
    }
    this.totalAgendamento = totAgend;

  }
  
  RetornoTempoMedioAtendimento(retorno: string) {
    const ret: string = JSON.stringify(retorno);
    const retTma: RetornoTempoMedioAtendimento = JSON.parse(ret);
    const xxx = moment.duration(retTma.Value);
    this.totalTempoMedioAtendimento = this.PadLeft(xxx.hours()) + ':'
      + this.PadLeft(xxx.minutes()) + ':' + this.PadLeft(xxx.seconds());
  }

  PadLeft(valor: number): string {
    return (valor < 10) ? '0' + valor.toString() : valor.toString();
  }

  retornoTotalServicos(retorno: string) {
    const ret: string = JSON.stringify(retorno);
    const arr: RetornoServicos[] = JSON.parse(ret);


    let totServ = 0;

    if (arr.length !== 0) {
      for (let _i = 0; _i < arr.length; _i++) {

        const item: RetornoServicos = arr[_i];
        totServ += item.DocCount;

      }
      this.servicos1 = arr[1].Key;
      this.totalServicos1 = arr[1].DocCount;
      this.servicos2 = arr[2].Key;
      this.totalServicos2 = arr[2].DocCount;
    } else {
      this.servicos1 = '';
      this.totalServicos1 = 0;
      this.servicos2 = '';
      this.totalServicos2 = 0;
    }
    this.totalServicos1 = totServ;

  }

  setErro(err: string) {
    const erro = JSON.stringify(err);
    const erro_json: Response = JSON.parse(erro);
    console.log(erro_json);
    if (erro_json.status === 401) {
      this.st.delTimer('5sec');
      this.retornoRefreshToken();
    }
  }

  retornoRefreshToken() {
    const start = sessionStorage.getItem('Current_user');
    if (start === null) {
      this.router.navigate(['login']);
    } else {
      const retornoToken: RetornoLogin = JSON.parse(start);
      let body = 'client_id=totem.dashboard.web&';
      body += 'client_secret=1dc3ddc9-18e9-40d4-ad13-6dc5c95760f6&';
      body += 'grant_type=refresh_token&';
      body += 'refresh_token=';
      body += retornoToken.refresh_token;
      this.authenticationService.refreshToken(body)
        .subscribe(value => this.rtk(value));
    }

  }

  rtk(retorno: string) {
    const ret: RetornoLogin = JSON.parse(JSON.stringify(retorno));
    console.log(ret);

    sessionStorage.setItem('Current_user', JSON.stringify(ret));
    this.st.newTimer('5sec', 15);
    this.st.subscribe('5sec', e => this.callback());

  }

  callback() {
    const dtIni = new Date();
    dtIni.setUTCHours(0, 0, 0, 0);

    const dtFim = new Date();
    dtFim.setUTCHours(23, 59, 59, 999);

    const usuario = sessionStorage.getItem('Current_user');

    if (usuario === null) {
      this.router.navigate(['login']);
    } else {
      const retornoToken: RetornoLogin = JSON.parse(usuario);
      this.tk = retornoToken.access_token;


      this.dashBoardService.buscarTotalAtendimento(this.tk, dtIni.getTime(), dtFim.getTime())
        .subscribe(value => this.retornoTotalAtendimento(value), err => this.setErro(err));
      this.dashBoardService.buscarPagamentosPinpad(this.tk, dtIni.getTime(), dtFim.getTime())
        .subscribe(value => this.retornoTotalPagamentos(value), err => this.setErro(err));
      this.dashBoardService.buscarEmissaoDare(this.tk, dtIni.getTime(), dtFim.getTime())
        .subscribe(value => this.retornoTotalDare(value), err => this.setErro(err));
      this.dashBoardService.buscarTotalAgendamento(this.tk, dtIni.getTime(), dtFim.getTime())
        .subscribe(value => this.retornoTotalAgendamento(value), err => this.setErro(err));
      this.dashBoardService.buscarTempoMedioAtendimento(this.tk, dtIni.getTime(), dtFim.getTime())
        .subscribe(value => this.RetornoTempoMedioAtendimento(value), err => this.setErro(err));
      this.dashBoardService.buscarTotalServicos(this.tk, dtIni.getTime(), dtFim.getTime())
        .subscribe(value => this.retornoTotalServicos(value), err => this.setErro(err));

    }
  }

  ngOnInit() {
    this.st.newTimer('5sec', 15);
    this.st.subscribe('5sec', e => this.callback());
    this.totalPagamentos = 0;
    //this.limpaIndicadores();
    //executaServicos();
  }
  /*if (localStorage.getItem('Current user') === null) {
    $(location).attr('href','http://localhost:4200/#/login'); 
  }

  var token = '';

  authenticateUser();

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
        localStorage.setItem('Current user', token);

      },
        error: function(result) {
          console.log(JSON.stringify(result));
        },
    });
  }

  function limpaIndicadores() {
    $('.total-atendimentos').empty().append('0');
    $('.total-agendamentos').empty().append('0');
    $('.total-solicitacao-identidade').empty().append('0');
    $('.total-emissao-antecedentes').empty().append('0');
    $('.total-pinpad').empty().append('0');
    $('.total-agendamento-carteira').empty().append('0');
    $('.total-agendamento-identidade').empty().append('0');
    $('.total-agendamento-seguro').empty().append('0');
    $('.total-dare').empty().append('0');
    $('.total-tma').empty().append('00:00:00');

    $('.atendimento-top-1-nome').empty().append('');
    $('.atendimento-top-2-nome').empty().append('');
    $('.atendimento-top-3-nome').empty().append('');
    $('.atendimento-bottom-1-nome').empty().append('');
    $('.atendimento-bottom-2-nome').empty().append('');
    $('.atendimento-bottom-3-nome').empty().append('');

    $('.atendimento-top-1').css('width', '0%').attr('aria-valuenow', 0);
    $('.atendimento-top-2').css('width', '0%').attr('aria-valuenow', 0);
    $('.atendimento-top-3').css('width', '0%').attr('aria-valuenow', 0);

    $('.atendimento-bottom-1').css('width', '0%').attr('aria-valuenow', 0);
    $('.atendimento-bottom-2').css('width', '0%').attr('aria-valuenow', 0);
    $('.atendimento-bottom-3').css('width', '0%').attr('aria-valuenow', 0);
  }

  function executaServicos() {
    
    setInterval(function() 
    {
      SolicitacaoCarteira_EmissaoAtestado();
      Tma();
      ContagemDare();
      TotalAtendimentos();
      AgendamentosTop();
      PagamentosPinPad();
      AtendimentosTopBottom();
    }, 5000);
  }

  // Solicitação de Carteira / Emissão de Atestados
  // GET http://desenv.car.api.sp.gov.br/api/totem/dashboard/tipo/inicio/1499385600000/fim/1499471999000
  function SolicitacaoCarteira_EmissaoAtestado() {

    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var currentFormatDate = '';
    currentFormatDate = currentFormatDate.concat(year.toString(), '-', month.toString(), '-', day.toString());

    var urlApi = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/';
    var tipoServico = 'tipo/';
    var dataInicioFormatado = '';
    var dataFimFormatado = '';
    var dataInicio = new Date(dataInicioFormatado.concat(currentFormatDate, ' 00:00:00.000')).valueOf().toString();
    var dataFim = new Date(dataFimFormatado.concat(currentFormatDate, ' 23:59:59.000')).valueOf().toString();
    var urlCompletaFormatada = '';
    var urlCompleta = urlCompletaFormatada.concat(urlApi, tipoServico, 'inicio/', dataInicio, '/fim/', dataFim);

    //console\.log\(urlCompleta\);

    var headerParam = 'bearer ' +  this.tk;

    $.ajax({
      type: 'GET',
      contentType : 'application/json',
      dataType: 'json',
      url: urlCompleta,
      beforeSend: function(request) {
        request.setRequestHeader('Authorization', headerParam);
      },
      success: function (data) {
        if ( data !== null && data !== '') {
          $(data).each( function() {
            if( this.Key === 'Agendamento')
              $('.total-agendamentos').empty().append(this.DocCount);
            if( this.Key === 'Solicitação - Carteira de identidade')
              $('.total-solicitacao-identidade').empty().append(this.DocCount);
            if( this.Key === 'Emissão - Atestado de antecedentes')
              $('.total-emissao-antecedentes').empty().append(this.DocCount);
          });
        }
      },
      error: function (error) {

        console.log('ERRO: ' + JSON.stringify(error));
        authenticateUser();
      },
    });
  }

  // Tempo médio de atendimento:
  // http://desenv.car.api.sp.gov.br/api/totem/dashboard/tma/inicio/1499385600000/fim/1499471999000
  function Tma() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var currentFormatDate = '';
    currentFormatDate = currentFormatDate.concat(year.toString(), '-', month.toString(), '-', day.toString());

    var urlApi = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/';
    var tipoServico = 'tma/';
    var dataInicioFormatado = '';
    var dataFimFormatado = '';
    var dataInicio = new Date(dataInicioFormatado.concat(currentFormatDate, ' 00:00:00.000')).valueOf().toString();
    var dataFim = new Date(dataFimFormatado.concat(currentFormatDate, ' 23:59:59.000')).valueOf().toString();
    var urlCompletaFormatada = '';
    var urlCompleta = urlCompletaFormatada.concat(urlApi, tipoServico, 'inicio/', dataInicio, '/fim/', dataFim);

    //console.log(urlCompleta);

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
        if ( data !== null && data !== '') {
          $(data).each( function() {
            var hours = Math.floor(((parseFloat(this.Value) / 1000)/60)/60);
            var divisor_for_minutes = parseFloat(this.Value) % (60 * 60);
            var minutes = Math.floor(((parseFloat(this.Value) / 1000)/60));
            var divisor_for_seconds = divisor_for_minutes % 60;
            var seconds = Math.ceil(divisor_for_seconds);
            
            $('.total-tma').empty().append('00'.substring(0, ('00').length -  hours.toString().length) + hours + ':' + 
                                           '00'.substring(0, ('00').length -  minutes.toString().length) + minutes + ':' + 
                                           '00'.substring(0, ('00').length -  seconds.toString().length) + seconds);
           });
        }
      },
      error: function (error) {
        console.log('ERRO: ' + JSON.stringify(error));
        authenticateUser();
      },
    });
  }

  // Contagem de DAREs:
  // GET http://desenv.car.api.sp.gov.br/api/totem/dashboard/dare/count/inicio/1499385600000/fim/1499471999000
  function ContagemDare() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var currentFormatDate = '';
    currentFormatDate = currentFormatDate.concat(year.toString(), '-', month.toString(), '-', day.toString());

    var urlApi = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/';
    var tipoServico = 'dare/count/';
    var dataInicioFormatado = '';
    var dataFimFormatado = '';
    var dataInicio = new Date(dataInicioFormatado.concat(currentFormatDate, ' 00:00:00.000')).valueOf().toString();
    var dataFim = new Date(dataFimFormatado.concat(currentFormatDate, ' 23:59:59.000')).valueOf().toString();
    var urlCompletaFormatada = '';
    var urlCompleta = urlCompletaFormatada.concat(urlApi, tipoServico, 'inicio/', dataInicio, '/fim/', dataFim);

    //console.log(urlCompleta);

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
        if( data !== null && data !== '') {
          $('.total-dare').empty().append(data.count);
        }
      },
      error: function (error) {
        console.log('ERRO: ' + JSON.stringify(error));
        authenticateUser();
      },
    });
  }

  // Total de Atendimentos:
  // GET http://desenv.car.api.sp.gov.br/api/totem/dashboard/atendimento/count/inicio/1499385600000/fim/1499471999000
  function TotalAtendimentos() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var currentFormatDate = '';
    currentFormatDate = currentFormatDate.concat(year.toString(), '-', month.toString(), '-', day.toString());

    var urlApi = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/';
    var tipoServico = 'atendimento/count/';
    var dataInicioFormatado = '';
    var dataFimFormatado = '';
    var dataInicio = new Date(dataInicioFormatado.concat(currentFormatDate, ' 00:00:00.000')).valueOf().toString();
    var dataFim = new Date(dataFimFormatado.concat(currentFormatDate, ' 23:59:59.000')).valueOf().toString();
    var urlCompletaFormatada = '';
    var urlCompleta = urlCompletaFormatada.concat(urlApi, tipoServico, 'inicio/', dataInicio, '/fim/', dataFim);

    //console.log(urlCompleta);

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
          $(data).each( function() {
            if (this.Key === 'FINALIZADO')
              $('.total-atendimentos').empty().append(this.DocCount);
          });
        }
      },
      error: function (error) {
        console.log('ERRO: ' + JSON.stringify(error));
        authenticateUser();
      },
    });
  }

  // Top serviços agendados
  // GET http://desenv.car.api.sp.gov.br/api/totem/dashboard/agendamento/top/inicio/1499385600000/fim/1499471999000
  function AgendamentosTop() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var currentFormatDate = '';
    currentFormatDate = currentFormatDate.concat(year.toString(), '-', month.toString(), '-', day.toString());

    var urlApi = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/';
    var tipoServico = 'agendamento/top/';
    var dataInicioFormatado = '';
    var dataFimFormatado = '';
    var dataInicio = new Date(dataInicioFormatado.concat(currentFormatDate, ' 00:00:00.000')).valueOf().toString();
    var dataFim = new Date(dataFimFormatado.concat(currentFormatDate, ' 23:59:59.000')).valueOf().toString();
    var urlCompletaFormatada = '';
    var urlCompleta = urlCompletaFormatada.concat(urlApi, tipoServico, 'inicio/', dataInicio, '/fim/', dataFim);

    //console.log(urlCompleta);

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
          $(data).each( function() {
            if( this.Key === 'CARTEIRA DE TRABALHO')
              $('.total-agendamento-carteira').empty().append(this.DocCount);
            if( this.Key === 'CARTEIRA DE IDENTIDADE')
              $('.total-agendamento-identidade').empty().append(this.DocCount);
            if( this.Key === 'SEGURO DESEMPREGO')
              $('.total-agendamento-seguro').empty().append(this.DocCount);
          });
        }
      },
      error: function (error) {
        console.log('ERRO: ' + JSON.stringify(error));
        authenticateUser();
      },
    });
  }

  // Pagamentos com PinPad
  // GET http://desenv.car.api.sp.gov.br/api/totem/dashboard/pagamento/count/inicio/1499385600000/fim/1499471999000
  function PagamentosPinPad() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var currentFormatDate = '';
    currentFormatDate = currentFormatDate.concat(year.toString(), '-', month.toString(), '-', day.toString());

    var urlApi = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/';
    var tipoServico = 'pagamento/count/';
    var dataInicioFormatado = '';
    var dataFimFormatado = '';
    var dataInicio = new Date(dataInicioFormatado.concat(currentFormatDate, ' 00:00:00.000')).valueOf().toString();
    var dataFim = new Date(dataFimFormatado.concat(currentFormatDate, ' 23:59:59.000')).valueOf().toString();
    var urlCompletaFormatada = '';
    var urlCompleta = urlCompletaFormatada.concat(urlApi, tipoServico, 'inicio/', dataInicio, '/fim/', dataFim);

    //console\.log\(urlCompleta\);

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
          $('.total-pinpad').empty().append(data.count);
        }
      },
      error: function (error) {
        console.log('ERRO: ' + JSON.stringify(error));
        authenticateUser();
      },
    });
  }

  // Top/Bottom  3 Atendimentos
  // GET http://desenv.car.api.sp.gov.br/api/totem/dashboard/local/topbottom/inicio/1499385600000/fim/1499471999000
  function AtendimentosTopBottom() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();
    var currentFormatDate = '';
    currentFormatDate = currentFormatDate.concat(year.toString(), '-', month.toString(), '-', day.toString());

    var urlApi = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/';
    var tipoServico = 'local/topbottom/';
    var dataInicioFormatado = '';
    var dataFimFormatado = '';
    var dataInicio = new Date(dataInicioFormatado.concat(currentFormatDate, ' 00:00:00.000')).valueOf().toString();
    var dataFim = new Date(dataFimFormatado.concat(currentFormatDate, ' 23:59:59.000')).valueOf().toString();
    var urlCompletaFormatada = '';
    var urlCompleta = urlCompletaFormatada.concat(urlApi, tipoServico, 'inicio/', dataInicio, '/fim/', dataFim);

    //console.log(urlCompleta);

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
        if ( data !== null && data !== '') {
          var top = 0;
          var bottom = 0;

          $(data).each( function(index) {
            if (index === 0) {
              top = this.DocCount;
            } else if (index === 3) {
              bottom = this.DocCount;
            }

            if (index < 3) {
              $('.atendimento-top-' + (index + 1) + '-nome').empty().append(this.Key);
              $('.atendimento-top-' + (index + 1).toString()).css('width', ((this.DocCount * 100) / top) +'%').attr('aria-valuenow', ((this.DocCount * 100) / top));
            } else {
              $('.atendimento-bottom-' + (index - 2) + '-nome').empty().append(this.Key);
              $('.atendimento-bottom-' + (index - 2).toString()).css('width', ((this.DocCount * 100) / bottom) +'%').attr('aria-valuenow', ((this.DocCount * 100) / bottom));
            }      
          });
        }
      },
      error: function (error) {
        console.log('ERRO: ' + JSON.stringify(error));
        authenticateUser();
      },
    });
  }*/

  // Volumetria
  // GET http://desenv.car.api.sp.gov.br/api/totem/dashboard/volumetria/inicio/1499385600000/fim/1499471999000

  // Satisfação
  // GET http://desenv.car.api.sp.gov.br/api/totem/dashboard/satisfacao/inicio/1499385600000/fim/1499471999000

  // Solicitação de Carteira / Emissão de Atestados
  // GET http://desenv.car.api.sp.gov.br/api/totem/dashboard/tipo/inicio/1499385600000/fim/1499471999000
}
