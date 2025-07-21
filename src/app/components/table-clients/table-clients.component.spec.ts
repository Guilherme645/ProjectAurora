/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TableClientsComponent } from './table-clients.component';

describe('TableClientsComponent', () => {
  let component: TableClientsComponent;
  let fixture: ComponentFixture<TableClientsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableClientsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableClientsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
