import { ConstantServiceProvider } from './../constant-service/constant-service';
import { HttpClient, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from '../../../node_modules/rxjs/Observable';

/*
  Generated class for the HttpInterceptorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HttpInterceptorProvider implements HttpInterceptor {
 

  constructor(public http: HttpClient, 
    private constantService: ConstantServiceProvider) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = this.constantService.getConstantObject().serverUrl;
    if(!req.url.includes("assets"))
    req = req.clone({
      url: url + req.url
    });
    return next.handle(req);
  }


}
