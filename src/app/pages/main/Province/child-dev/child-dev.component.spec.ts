import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildDevComponent } from './child-dev.component';

describe('ChildDevComponent', () => {
  let component: ChildDevComponent;
  let fixture: ComponentFixture<ChildDevComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildDevComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChildDevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
