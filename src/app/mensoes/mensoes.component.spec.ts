import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensoesComponent } from './mensoes.component';

describe('MensoesComponent', () => {
  let component: MensoesComponent;
  let fixture: ComponentFixture<MensoesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MensoesComponent]
    });
    fixture = TestBed.createComponent(MensoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
