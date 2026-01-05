import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentenceGameComponent } from './sentence-game.component';

describe('SentenceGameComponent', () => {
  let component: SentenceGameComponent;
  let fixture: ComponentFixture<SentenceGameComponent>;

  beforeEach(async) {
    await TestBed.configureTestingModule({
      declarations: [ SentenceGameComponent ]
    })
    .compileComponents();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(SentenceGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
