import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { Gender } from '../models/gender.model';

@Injectable({ providedIn: 'root' })
export class SelectOptionsService {
  private baseApiUrl = `${environment.apiUrl}/${environment.apiVersion}`;

  constructor(private http: HttpClient) {}

  getGenderSelectOption(): Observable<Gender[]> {
    const gendersUrl = `${this.baseApiUrl}/genders`;

    return this.http.get<Gender[]>(gendersUrl);
  }
}
