import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LessonService {
  private apiUrl = 'https://senrevision.com/wp-json/wp/v2/ib_educator_lesson';

  constructor(private http: HttpClient) { }

  getFilteredLessons(courseId: string): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(lessons => {
        console.log('All lessons:', lessons);
        const filteredLessons = lessons.filter(lesson => lesson._ibedu_course === courseId);
        console.log('Filtered lessons:', filteredLessons);
        return filteredLessons;
      })
    );
  }
}
