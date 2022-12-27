import { Injectable } from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse
} from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor(){
    }
    API_KEY="cHbxCaxkS6NXwrKDJm0nBzxUuvXAdGLd";
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authReq = req.clone({
         setHeaders:{
            // access_key:this.API_KEY
            apikey:this.API_KEY
         }
      });

    return next.handle(authReq).pipe(
      map(res => {
         return res
      }),
      catchError((error: HttpErrorResponse) => {
         let errorMsg = '';
         if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
         } else {
            errorMsg = `Error Code: ${error.status},  Message: ${error.error.message}`;
         }
         return throwError(errorMsg);
      })
)
  }
}