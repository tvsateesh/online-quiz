import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordHuntComponent } from './word-hunt.component';

describe('WordHuntComponent', () => {
  let component: WordHuntComponent;
  let fixture: ComponentFixture<WordHuntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordHuntComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
