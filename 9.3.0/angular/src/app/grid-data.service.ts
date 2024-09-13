import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GridDataDto } from '@app/grid-data.dto'; 
@Injectable({
  providedIn: 'root'
})
export class GridDataService {

 
  private apiUrl = 'https://localhost:44311/api/services/app/GridData';

  constructor(private http: HttpClient) {}

  getGridData(): Observable<GridDataDto[]> {
    return this.http.get<GridDataDto[]>(`https://localhost:44311/api/services/app/GridData/GetAllGridData`);
  }

  deleteGridData(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/DeleteGridData?Id=${id}`);
  }
}
