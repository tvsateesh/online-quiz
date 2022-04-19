import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OddManOutComponent } from './odd-man-out.component';

describe('OddManOutComponent', () => {
  let component: OddManOutComponent;
  let fixture: ComponentFixture<OddManOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OddManOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OddManOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
