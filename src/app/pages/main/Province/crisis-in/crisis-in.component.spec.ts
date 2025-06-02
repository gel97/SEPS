import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrisisInComponent } from './crisis-in.component';

describe('CrisisInComponent', () => {
  let component: CrisisInComponent;
  let fixture: ComponentFixture<CrisisInComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrisisInComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrisisInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
