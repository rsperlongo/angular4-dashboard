import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    private token: string;
    private header: Headers;

    constructor(private http: Http) { 
        this.header = new Headers();
        this.header.append('Content-Type', 'application/x-www-form-urlencoded');
        this.header.append( 'Accept', 'application/json' );
    }

    login(body: string): Observable<string> {
        return this.http.post('http://http://xxx.xxx.xxx.xx.xxx.xx/connect/token', 
                            body, 
                            { headers: this.header })
                        .map((response: Response) => response.json());

    }
    refreshToken(body: string): Observable<string> {

        return this.http.post('http://http://xxx.xxx.xxx.xx.xxx.xx/connect/token', 
                            body, 
                            { headers: this.header })
                        .map((response: Response) => response.json());
    }

    logout(): void {
        localStorage.removeItem('Current user');
    }
}
