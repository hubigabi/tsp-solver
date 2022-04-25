import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TspAlgorithmsComponent} from "./tsp-algorithms/tsp-algorithms.component";
import {GraphSppComponent} from "./graph-spp/graph-spp.component";

const routes: Routes = [
  {path: '', component: TspAlgorithmsComponent},
  {path: 'graph-spp', component: GraphSppComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
