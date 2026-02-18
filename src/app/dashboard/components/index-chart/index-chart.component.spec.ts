/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IndexChartComponent } from './index-chart.component';

describe('IndexChartComponent', () => {
  let component: IndexChartComponent;
  let fixture: ComponentFixture<IndexChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndexChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
