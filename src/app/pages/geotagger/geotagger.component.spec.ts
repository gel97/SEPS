import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeotaggerComponent } from './geotagger.component';

describe('GeotaggerComponent', () => {
  let component: GeotaggerComponent;
  let fixture: ComponentFixture<GeotaggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeotaggerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeotaggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
