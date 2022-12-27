import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor(){
    }
    API_KEY="WD5va4A2zHT367tmKMIdwnKxZcxIyebc";
    // API_KEY="eBs4eEODXk19eGcPqd4GFGQFOvJMC3cn";
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
         setHeaders:{
            // access_key:this.API_KEY
            apikey:this.API_KEY
         }
      });

    return next.handle(authReq);
  }
}