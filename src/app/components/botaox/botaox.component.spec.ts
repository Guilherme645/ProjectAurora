import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotaoxComponent } from './botaox.component';

describe('BotaoxComponent', () => {
  let component: BotaoxComponent;
  let fixture: ComponentFixture<BotaoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotaoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotaoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
