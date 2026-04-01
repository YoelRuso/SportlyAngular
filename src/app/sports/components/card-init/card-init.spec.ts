import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardInit } from './card-init';

describe('CardInit', () => {
  let component: CardInit;
  let fixture: ComponentFixture<CardInit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardInit],
    }).compileComponents();

    fixture = TestBed.createComponent(CardInit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
