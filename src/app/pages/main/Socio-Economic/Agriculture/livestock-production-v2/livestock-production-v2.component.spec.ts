import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivestockProductionV2Component } from './livestock-production-v2.component';

describe('LivestockProductionV2Component', () => {
  let component: LivestockProductionV2Component;
  let fixture: ComponentFixture<LivestockProductionV2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LivestockProductionV2Component ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivestockProductionV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
