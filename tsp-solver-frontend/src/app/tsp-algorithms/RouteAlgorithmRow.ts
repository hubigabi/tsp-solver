export interface RouteAlgorithmRow {
  id: number;
  algorithmType: string;
  parameters: string;
  calculationTime: number;
  totalCost: number;
  citiesOrder: number[];
  completed: boolean
}
