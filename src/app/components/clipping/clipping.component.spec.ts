/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ClippingComponent } from './clipping.component';

describe('ClippingComponent', () => {
  let component: ClippingComponent;
  let fixture: ComponentFixture<ClippingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClippingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
