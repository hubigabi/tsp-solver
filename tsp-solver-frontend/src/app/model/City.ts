export class City {
  id: number;
  x: number;
  y: number;

  constructor(id: number, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  static generateRandomCities(n: number, cityMaxX: number, cityMaxY: number): City[] {
    const cities: City[] = [];
    for (let i = 0; i < n; i++) {
      let city = new City(i, Math.random() * cityMaxX, Math.random() * cityMaxY);
      cities.push(city);
    }
    return cities;
  }

  static toCostMatrix(cities: City[]): number[][] {
    const costMatrix: number[][] = [];
    for (let i = 0; i < cities.length; i++) {
      costMatrix[i] = [];
      for (let j = 0; j < cities.length; j++) {
        costMatrix[i][j] = Math.hypot(Math.abs(cities[i].x - cities[j].x), Math.abs(cities[i].y - cities[j].y));
      }
    }
    return costMatrix;
  }

}
