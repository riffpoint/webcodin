import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortingBtnComponent } from './sorting-btn.component';

describe('SortingBtnComponent', () => {
  let component: SortingBtnComponent;
  let fixture: ComponentFixture<SortingBtnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SortingBtnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortingBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
