import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegSeniorComponent } from './reg-senior.component';

describe('RegSeniorComponent', () => {
  let component: RegSeniorComponent;
  let fixture: ComponentFixture<RegSeniorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegSeniorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegSeniorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
