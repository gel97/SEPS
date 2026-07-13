import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SEEPComponent } from './seep.component';

describe('SEEPComponent', () => {
  let component: SEEPComponent;
  let fixture: ComponentFixture<SEEPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SEEPComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SEEPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
