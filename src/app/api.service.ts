import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from './course.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://senrevision.com/wp-json/wp/v2/ib_educator_course';

  constructor(private http: HttpClient) { }

  getCourses(page: number = 1, perPage: number = 6): Observable<Course[]> {
    const url = `${this.apiUrl}?page=${page}&per_page=${perPage}`;
    return this.http.get<Course[]>(url);
  }
}
