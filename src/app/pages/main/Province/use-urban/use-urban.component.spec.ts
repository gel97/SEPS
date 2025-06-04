import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UseUrbanComponent } from './use-urban.component';

describe('UseUrbanComponent', () => {
  let component: UseUrbanComponent;
  let fixture: ComponentFixture<UseUrbanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UseUrbanComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UseUrbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
