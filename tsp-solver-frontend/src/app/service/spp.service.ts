import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {SppRequest} from "../model/request/spp/SppRequest";
import {SppResult} from "../model/request/spp/SppResult";

@Injectable({
  providedIn: 'root'
})
export class SppService {

  private readonly SPP_URL = environment.backendUrl + '/api/spp';

  constructor(private httpClient: HttpClient) {
  }

  public getSppResult(sppRequest: SppRequest): Observable<SppResult> {
    return this.httpClient.post<SppResult>(this.SPP_URL, sppRequest);
  }

}
