import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteAlgorithmTableComponent } from './route-algorithm-table.component';

describe('RouteAlgorithmTableComponent', () => {
  let component: RouteAlgorithmTableComponent;
  let fixture: ComponentFixture<RouteAlgorithmTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RouteAlgorithmTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RouteAlgorithmTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
