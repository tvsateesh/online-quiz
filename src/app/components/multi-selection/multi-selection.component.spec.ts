import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultSelectionComponent } from './multi-selection.component';

describe('MultSelectionComponent', () => {
  let component: MultSelectionComponent;
  let fixture: ComponentFixture<MultSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
