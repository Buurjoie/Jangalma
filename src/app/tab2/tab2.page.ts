import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page implements OnInit {
  private baseURL = 'https://senrevision.com/wp-json/wp/v2';
  categoryData: any;
  courses: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadCategoryData(248);
  }

  loadCategoryData(categoryId: number) {
    this.http.get<any>(`${this.baseURL}/ib_educator_category/${categoryId}`).subscribe(
      (data) => {
        this.categoryData = data;
        this.loadCourses(categoryId);
      },
      (error) => {
        console.error('Error fetching category data:', error);
      }
    );
  }

  loadCourses(categoryId: number) {
    this.http.get<any[]>(`${this.baseURL}/ib_educator_lesson?ib_educator_category=${categoryId}&_embed`).subscribe(
      (data) => {
        this.courses = data.map(lesson => {
          const thumbnail = lesson._embedded['wp:featuredmedia'] && lesson._embedded['wp:featuredmedia'].length > 0
            ? lesson._embedded['wp:featuredmedia'][0].source_url
            : 'https://classetice.fr/v2/wp-content/uploads/2022/09/bib.jpg'; // Default image
  
          return {
            title: lesson.title.rendered,
            content: lesson.content.rendered,
            link: lesson.link,
            thumbnail,
          };
        });
      },
      (error) => {
        console.error('Error fetching courses:', error);
      }
    );
  }
  
  
}
