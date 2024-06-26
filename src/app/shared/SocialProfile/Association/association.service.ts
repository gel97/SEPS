import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { BaseUrl } from 'src/app/services/baseUrl.service';
import { ApiUrl } from 'src/app/services/apiUrl.service';

@Injectable({
  providedIn: 'root'
})

export class AssociationService {

  api: any;

  constructor(private http: HttpClient, private ApiUrl: ApiUrl, private Base:BaseUrl ) {
    this.api = this.Base.url;
   }

  GetAssociation(menuId :any, setYear  :any,munCityId :any) {
    return this.http.get<any[]>(this.Base.url + this.ApiUrl.get_list_associations(menuId, setYear, munCityId), { responseType: 'json' });
  }

  AddAssociation(association: any={}) {
    console.log(association);
    return this.http.post(this.Base.url + this.ApiUrl.post_association(),association, { responseType: 'json' });
  }


  EditAssociation(association:any) {
    return this.http.put<any[]>(this.Base.url + this.ApiUrl.put_association(),association, { responseType: 'json' });
  }

  DeleteAssociation(transId: any) {
    return this.http.delete(this.Base.url + this.ApiUrl.delete_association(transId), { responseType: 'text' });
  }

  ListOfBarangay(munCityId:any)
  {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_list_barangay(munCityId), { responseType: 'json' });

  }
  Import(menuId :any,):Observable<any[]> {
    return this.http.post<any[]>(this.Base.url + this.ApiUrl.post_import_association(menuId), { responseType: 'json' });
  }

}
