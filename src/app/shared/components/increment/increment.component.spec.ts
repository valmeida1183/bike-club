import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementComponent } from './increment.component';

describe('IncrementComponent', () => {
  let component: IncrementComponent;
  let fixture: ComponentFixture<IncrementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncrementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncrementComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
