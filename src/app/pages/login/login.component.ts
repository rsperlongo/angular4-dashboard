import { RetornoLogin } from './../../_models/login.model';
import { AuthenticationService } from './../../_services/authentication.service';
import { Router } from '@angular/router';
import { RouterModule, Routes, ActivatedRoute  } from '@angular/router';
import * as moment from 'moment';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  moduleId: module.id,
  selector: 'nga-component-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.scss'],
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading: false;
  returnUrl: string;
 // loading: any;
  error: 'Usuário ou Senha Incorretos';

  public form: FormGroup;
  public password: any;
  private submitted: boolean = false;
  private body: string;
  public username: any;

  @ViewChild('userNameText') userNameText;
  @ViewChild('passwordText') passwordText;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    fb: FormBuilder) {
    this.form = fb.group({
      'username': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(4)])],
    });

    this.username = this.form.controls['username'];
    this.password = this.form.controls['password'];
  }

  ngOnInit() {
    this.authenticationService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.userNameText.nativeElement.value = "44444444444";
    this.passwordText.nativeElement.value = "prodesp";
  }
  fazerLogin() {

    this.body = "grant_type=password&";
    this.body += "client_id=totem.dashboard.web&";
    this.body += "client_secret=1dc3ddc9-18e9-40d4-ad13-6dc5c95760f6&";
    this.body += "username=" + this.userNameText.nativeElement.value + "&";
    this.body += "password=" + this.passwordText.nativeElement.value + "&";
    this.body += "scope=openid profile offline_access Dashboard.Search";
    this.authenticationService.login(this.body)
    .subscribe(value => this.retornoLogin(value),
               data => {this.router.navigate([this.returnUrl])
              });

  }
  retornoLogin(retorno: string) {
    let ret: RetornoLogin = JSON.parse(JSON.stringify(retorno));
    sessionStorage.setItem('Current_user', JSON.stringify(ret));
   // localStorage.setItem('Current user', ret.access_token);
    console.log(ret);
    
    this.router.navigate(['./pages/dashboard']);

  }
}

