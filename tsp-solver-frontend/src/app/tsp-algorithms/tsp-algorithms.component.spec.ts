import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TspAlgorithmsComponent} from './tsp-algorithms.component';
import {TranslateModule} from "@ngx-translate/core";

describe('TspAlgorithmsComponent', () => {
  let component: TspAlgorithmsComponent;
  let fixture: ComponentFixture<TspAlgorithmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TspAlgorithmsComponent],
      imports: [TranslateModule.forRoot()],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TspAlgorithmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
