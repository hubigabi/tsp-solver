import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RouteAlgorithm} from "../model/RouteAlgorithm";
import {SppRequest} from "../model/request/spp/SppRequest";

@Injectable({
  providedIn: 'root'
})
export class SppService {

  private readonly SPP_URL = environment.backendUrl + '/api/spp';

  constructor(private httpClient: HttpClient) {
  }

  public getSppResult(sppRequest: SppRequest): Observable<any> {
    return this.httpClient.post<any>(this.SPP_URL, sppRequest);
  }

}
