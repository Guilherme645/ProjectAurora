import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighSearchComponent } from './high-search.component';

describe('HighSearchComponent', () => {
  let component: HighSearchComponent;
  let fixture: ComponentFixture<HighSearchComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HighSearchComponent]
    });
    fixture = TestBed.createComponent(HighSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
