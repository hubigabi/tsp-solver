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

}
