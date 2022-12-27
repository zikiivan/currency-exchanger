import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

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

    return next.handle(authReq).pipe(
      map(res => {
         console.log("Passed through the interceptor in response");
         return res
      }),
      catchError((error: HttpErrorResponse) => {
         let errorMsg = '';
         if (error.error instanceof ErrorEvent) {
            console.log('This is client side error');
            errorMsg = `Error: ${error.error.message}`;
         } else {
            console.log('This is server side error');
            errorMsg = `Error Code: ${error.status},  Message: ${error.error.message}`;
         }
         console.log(errorMsg);
         return throwError(errorMsg);
      })
)
  }
}