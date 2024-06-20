import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlantService {
  private apiUrl = 'http://localhost:8000/...';

  constructor(private http: HttpClient) { }

  analyzeImage(image: any): Observable<any> {
    return this.http.post(this.apiUrl, image)
  }
}
