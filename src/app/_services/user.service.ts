import { AuthenticationService } from './authentication.service';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from 'app/_models/user';

import 'rxjs/add/operator/map';


@Injectable()
export class UserService {
    constructor( private http: Http) { }

    getUser( tk: string): Observable<User[]> {
        const headers = new Headers({ 'Authorization': + 'Bearer ' + tk });
        const options = new RequestOptions({ headers });

        return this.http.post('http://desenv.autenticador.sp.gov.br/connect/token', options)
            .map((response: Response) => response.json());
    }


}

