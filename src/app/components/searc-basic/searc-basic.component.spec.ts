import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearcBasicComponent } from './searc-basic.component';

describe('SearcBasicComponent', () => {
  let component: SearcBasicComponent;
  let fixture: ComponentFixture<SearcBasicComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearcBasicComponent]
    });
    fixture = TestBed.createComponent(SearcBasicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
