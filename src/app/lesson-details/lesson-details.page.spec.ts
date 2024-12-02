import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LessonDetailsPage } from './lesson-details.page';

describe('LessonDetailsPage', () => {
  let component: LessonDetailsPage;
  let fixture: ComponentFixture<LessonDetailsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LessonDetailsPage],
      imports: [],
      providers: [],
    }).compileComponents();

    fixture = TestBed.createComponent(LessonDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
