import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {NavbarComponent} from './navbar/navbar.component';
import {TspAlgorithmsComponent} from './tsp-algorithms/tsp-algorithms.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ValidationErrorComponent} from './validation-error/validation-error.component';
import {GraphSppComponent} from "./graph-spp/graph-spp.component";
import { FilterSelectedNodePipe } from './graph-spp/pipes/filter-selected-node.pipe';
import { RouteCostPipe } from './graph-spp/pipes/route-cost.pipe';
import { AlgorithmFormComponent } from './algorithm-form/algorithm-form.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    TspAlgorithmsComponent,
    ValidationErrorComponent,
    GraphSppComponent,
    FilterSelectedNodePipe,
    RouteCostPipe,
    AlgorithmFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NoopAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
