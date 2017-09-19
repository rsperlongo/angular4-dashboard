import { Observable } from 'rxjs/Observable';
import { Http, Headers, Response } from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';

import 'rxjs/add/operator/catch';

@Injectable()
export class DashBoardService {
    private header: Headers;
    constructor(private http: Http) { 
    }
    buscarTotalAtendimento(token: string, inicio: number, fim: number ): Observable<string> {
        this.header = new Headers();
        const bearer: string = 'Bearer ' + token;
        this.header.append('Authorization', bearer);
        let url = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/atendimento/count/inicio/' + inicio + '/fim/' + fim;
        
        return this.http.get(url, 
                            { headers: this.header })
                        .map((response: Response) => response.json())
                        .catch(this.handleError);

    }
    
    buscarPagamentosPinpad(token: string, inicio: number, fim: number ): Observable<string> {
        this.header = new Headers();
        const bearer: string = 'Bearer ' + token;
        this.header.append('Authorization', bearer);
        let url = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/pagamento/count/inicio/' + inicio + '/fim/' + fim;
        return this.http.get(url, 
                            { headers: this.header })
                        .map((response: Response) => response.json())
                        .catch(this.handleError);

    }

    buscarEmissaoDare(token: string, inicio: number, fim: number ): Observable<string> {
        this.header = new Headers();
        const bearer: string = 'Bearer ' + token;
        this.header.append('Authorization', bearer);
        let url = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/dare/count/inicio/' + inicio + '/fim/' + fim;
        
        return this.http.get(url, 
                            { headers: this.header })
                        .map((response: Response) => response.json())
                        .catch(this.handleError);

    }
    
    buscarTotalAgendamento(token: string, inicio: number, fim: number ): Observable<string> {
        this.header = new Headers();
        const bearer: string = 'Bearer ' + token;
        this.header.append('Authorization', bearer);
        let url = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/agendamento/top/inicio/' + inicio + '/fim/' + fim;
        
        return this.http.get(url, 
                            { headers: this.header })
                        .map((response: Response) => response.json())
                        .catch(this.handleError);

    }

    buscarTempoMedioAtendimento(token: string, inicio: number, fim: number ): Observable<string> {
        this.header = new Headers();
        const bearer: string = 'Bearer ' + token;
        this.header.append('Authorization', bearer);
        const url = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/tma/inicio/' + inicio + '/fim/' + fim;
        
        return this.http.get(url, 
                            { headers: this.header })
                        .map((response: Response) => response.json())
                        .catch(this.handleError);

    }
    
    buscarTotalServicos(token: string, inicio: number, fim: number ): Observable<string> {
        this.header = new Headers();
        const bearer: string = 'Bearer ' + token;
        this.header.append('Authorization', bearer);
        const url = 'http://desenv.car.api.sp.gov.br/api/totem/dashboard/tipo/inicio/' + inicio + '/fim/' + fim;
        
        return this.http.get(url, 
                            { headers: this.header })
                        .map((response: Response) => response.json())
                        .catch(this.handleError);

    }
    private handleError(error: Response) {
        const errorMsg = error.json().error || "Service error";
        return Observable.throw(error); 
    }

}
