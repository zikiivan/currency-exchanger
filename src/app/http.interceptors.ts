import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor(){
    }
    API_KEY="eba29bf5143cb8d3976f504df29a9b96";
    // API_KEY="eBs4eEODXk19eGcPqd4GFGQFOvJMC3cn";
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
         setParams:{
            access_key:this.API_KEY
         }
      });

    return next.handle(authReq);
  }
}