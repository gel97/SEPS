import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopShareComponent } from './pop-share.component';

describe('PopShareComponent', () => {
  let component: PopShareComponent;
  let fixture: ComponentFixture<PopShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopShareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
