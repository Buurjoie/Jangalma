import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailleBiblioPage } from './detaille-biblio.page';

describe('DetailleBiblioPage', () => {
  let component: DetailleBiblioPage;
  let fixture: ComponentFixture<DetailleBiblioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetailleBiblioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
