import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShoppListComponent } from './shopp-list.component';

describe('ShoppListComponent', () => {
  let component: ShoppListComponent;
  let fixture: ComponentFixture<ShoppListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
