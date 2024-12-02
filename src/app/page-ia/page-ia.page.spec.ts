import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageIAPage } from './page-ia.page';

describe('PageIAPage', () => {
  let component: PageIAPage;
  let fixture: ComponentFixture<PageIAPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PageIAPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
