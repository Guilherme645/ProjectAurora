import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageEsqueceuSenhaComponent } from './page-esqueceu-senha.component';

describe('PageEsqueceuSenhaComponent', () => {
  let component: PageEsqueceuSenhaComponent;
  let fixture: ComponentFixture<PageEsqueceuSenhaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageEsqueceuSenhaComponent]
    });
    fixture = TestBed.createComponent(PageEsqueceuSenhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
