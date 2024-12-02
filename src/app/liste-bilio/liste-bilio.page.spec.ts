import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListeBilioPage } from './liste-bilio.page';

describe('ListeBilioPage', () => {
  let component: ListeBilioPage;
  let fixture: ComponentFixture<ListeBilioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ListeBilioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
