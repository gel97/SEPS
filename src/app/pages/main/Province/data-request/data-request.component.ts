import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DataRequestService } from 'src/app/shared/Province/DataRequest.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-data-request',
  templateUrl: './data-request.component.html',
  styleUrls: ['./data-request.component.css'],
})
export class DataRequestComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private Service: DataRequestService,
    private modifyService: ModifyCityMunService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }
  munCityName: string = this.auth.munCityName;
  o_munCityId: any = '';

  ngOnInit(): void {
    //this.Init();
  }
  // Init() {
  //   this.GetListMunicipality();
  // }
}
