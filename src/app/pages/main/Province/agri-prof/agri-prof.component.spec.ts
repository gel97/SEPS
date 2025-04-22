import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgriProfComponent } from './agri-prof.component';

describe('AgriProfComponent', () => {
  let component: AgriProfComponent;
  let fixture: ComponentFixture<AgriProfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgriProfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgriProfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
