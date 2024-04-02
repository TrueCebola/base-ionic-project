import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SenhaExpiradaPage } from './senha-expirada.page';

describe('SenhaExpiradaPage', () => {
  let component: SenhaExpiradaPage;
  let fixture: ComponentFixture<SenhaExpiradaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SenhaExpiradaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
