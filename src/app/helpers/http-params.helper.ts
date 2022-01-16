import { HttpParams } from '@angular/common/http';

export class HttpParamsHelper {
  // Removes empty query string parameters
  static createHttpQueryParams(paramsObject: object): HttpParams {
    let httpParams = new HttpParams();

    for (const key in paramsObject) {
      if (paramsObject[key]) {
        httpParams = httpParams.set(key, paramsObject[key]);
      }
    }

    return httpParams;
  }
}
