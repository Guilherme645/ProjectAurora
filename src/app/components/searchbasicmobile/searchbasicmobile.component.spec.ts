import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchbasicmobileComponent } from './searchbasicmobile.component';

describe('SearchbasicmobileComponent', () => {
  let component: SearchbasicmobileComponent;
  let fixture: ComponentFixture<SearchbasicmobileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchbasicmobileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchbasicmobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
