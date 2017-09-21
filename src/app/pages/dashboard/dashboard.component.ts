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
  }
}
