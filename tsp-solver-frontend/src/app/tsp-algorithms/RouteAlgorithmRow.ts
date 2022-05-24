import {RequestStatus} from "./RequestStatus";

export interface RouteAlgorithmRow {
  id: number;
  algorithmType: string;
  parametersTranslation: string;
  parameters: any;
  calculationTime: number;
  totalCost: number;
  citiesOrder: number[];
  status: RequestStatus
}
