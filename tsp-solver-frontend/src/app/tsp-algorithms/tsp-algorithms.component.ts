import {Component, OnInit} from '@angular/core';
import * as paper from 'paper';
import {FormControl, Validators} from "@angular/forms";
import {City} from "../model/City";

@Component({
  selector: 'app-tsp-algorithms',
  templateUrl: './tsp-algorithms.component.html',
  styleUrls: ['./tsp-algorithms.component.css']
})
export class TspAlgorithmsComponent implements OnInit {

  readonly cityMaxX = 100;
  readonly cityMaxY = 100;

  citiesNumber = new FormControl(100, Validators.required);
  cities: City[] = []

  constructor() {
  }

  ngOnInit(): void {
    paper.setup('canvas');
    this.cities = City.generateRandomCities(100, this.cityMaxX, this.cityMaxY);
    this.drawCities(this.cities)
  }

  generateCities() {
    this.cities = City.generateRandomCities(this.citiesNumber.value, this.cityMaxX, this.cityMaxY);
    this.drawCities(this.cities)
  }

  drawCities(cities: City[]) {
    const widthRate = paper.view.size.width / this.cityMaxX;
    const heightRate = paper.view.size.height / this.cityMaxY;

    paper.project.clear();
    for (let city of cities) {
      new paper.Path.Circle({
        center: new paper.Point(city.x * widthRate, city.y * heightRate),
        radius: 3,
        fillColor: 'black',
      });
    }
  }

}
