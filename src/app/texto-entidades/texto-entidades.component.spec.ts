import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoEntidadesComponent } from './texto-entidades.component';

describe('TextoEntidadesComponent', () => {
  let component: TextoEntidadesComponent;
  let fixture: ComponentFixture<TextoEntidadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextoEntidadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextoEntidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
