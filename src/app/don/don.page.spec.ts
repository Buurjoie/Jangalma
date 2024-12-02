import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonPage } from './don.page';

describe('DonPage', () => {
  let component: DonPage;
  let fixture: ComponentFixture<DonPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
