/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { VeichlesTableComponent } from './veichles-table.component';

describe('VeichlesTableComponent', () => {
  let component: VeichlesTableComponent;
  let fixture: ComponentFixture<VeichlesTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VeichlesTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VeichlesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
