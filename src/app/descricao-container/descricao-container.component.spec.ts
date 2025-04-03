import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescricaoContainerComponent } from './descricao-container.component';

describe('DescricaoContainerComponent', () => {
  let component: DescricaoContainerComponent;
  let fixture: ComponentFixture<DescricaoContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DescricaoContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DescricaoContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
