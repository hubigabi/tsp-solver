import {ComponentFixture, TestBed} from '@angular/core/testing';
import {GraphSppComponent} from './graph-spp.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {SimpleNotificationsModule} from "angular2-notifications";
import {TranslateModule} from "@ngx-translate/core";
import {CostMatrixValidPipe} from "./pipes/cost-matrix-valid.pipe";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {MatSelectModule} from "@angular/material/select";

describe('GraphSppComponent', () => {
  let component: GraphSppComponent;
  let fixture: ComponentFixture<GraphSppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GraphSppComponent, CostMatrixValidPipe],
      imports: [ReactiveFormsModule,
        HttpClientTestingModule,
        NgbModule,
        MatSelectModule,
        SimpleNotificationsModule.forRoot(),
        TranslateModule.forRoot()]
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
