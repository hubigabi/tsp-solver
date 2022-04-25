import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphSppComponent } from './graph-spp.component';

describe('GraphSppComponent', () => {
  let component: GraphSppComponent;
  let fixture: ComponentFixture<GraphSppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphSppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphSppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
