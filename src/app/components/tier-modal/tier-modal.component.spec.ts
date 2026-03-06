/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TierModalComponent } from './tier-modal.component';

describe('TierModalComponent', () => {
  let component: TierModalComponent;
  let fixture: ComponentFixture<TierModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TierModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TierModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
