import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule, HttpClient} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './navbar/navbar.component';
import {TspAlgorithmsComponent} from './tsp-algorithms/tsp-algorithms.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ValidationErrorComponent} from './validation-error/validation-error.component';
import {GraphSppComponent} from "./graph-spp/graph-spp.component";
import {FilterSelectedNodePipe} from './graph-spp/pipes/filter-selected-node.pipe';
import {RouteCostPipe} from './graph-spp/pipes/route-cost.pipe';
import {AlgorithmFormComponent} from './algorithm-form/algorithm-form.component';
import {CostMatrixValidPipe} from './graph-spp/pipes/cost-matrix-valid.pipe';
import {RouteAlgorithmTableComponent} from './route-algorithm-table/route-algorithm-table.component';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {MatSelectModule} from '@angular/material/select';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {TitleCasePipe} from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TspAlgorithmsComponent,
    ValidationErrorComponent,
    GraphSppComponent,
    FilterSelectedNodePipe,
    RouteCostPipe,
    AlgorithmFormComponent,
    CostMatrixValidPipe,
    RouteAlgorithmTableComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NoopAnimationsModule,
    SimpleNotificationsModule.forRoot(),
    MatSelectModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    })
  ],
  providers: [TitleCasePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export function httpTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
