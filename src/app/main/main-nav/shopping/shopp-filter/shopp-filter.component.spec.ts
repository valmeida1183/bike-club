import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShoppFilterComponent } from './shopp-filter.component';

describe('ShoppFilterComponent', () => {
  let component: ShoppFilterComponent;
  let fixture: ComponentFixture<ShoppFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShoppFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShoppFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
