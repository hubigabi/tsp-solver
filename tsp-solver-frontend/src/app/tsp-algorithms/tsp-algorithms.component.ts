import {Component, OnInit} from '@angular/core';
import * as paper from 'paper';
import {FormControl, Validators} from "@angular/forms";
import {City} from "../model/City";
import {AlgorithmType} from "../model/AlgorithmType";

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
  chosenAlgorithm = "0";

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
      let cityCircle = new paper.Path.Circle({
        center: new paper.Point(city.x * widthRate, city.y * heightRate),
        radius: 3,
        fillColor: 'black',
      });
      const group = new paper.Group();
      group.addChild(cityCircle);

      cityCircle.onMouseEnter = function (event: MouseEvent) {
        const pointText = new paper.PointText(new paper.Point(this.position.x, this.position.y - 12));
        pointText.justification = 'center';
        pointText.fontSize = 16;
        pointText.fillColor = new paper.Color('white');
        pointText.strokeColor = new paper.Color('gray');
        pointText.content = 'City: ' + city.id;
        pointText.name = 'tooltip';
        this.parent.addChild(pointText);
      }

      cityCircle.onMouseLeave = function (event: MouseEvent) {
        let index = this.parent.children.findIndex(value => value.name === 'tooltip');
        this.parent.children[index].remove();
      }

    }
  }

  runAlgorithm() {
    console.log(this.chosenAlgorithm);
  }

}
