import { MunCityLocService } from './../../../../shared/Governance/mun-city-loc.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';

@Component({
  selector: 'app-city-location',
  templateUrl: './city-location.component.html',
  styleUrls: ['./city-location.component.css'],
})
export class CityLocationComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(private service: MunCityLocService, private auth: AuthService) {}
  MunLoc: any = [];

  editmodal: any = {};
  // UpdateBarangay:any ={};
  listBarangay: any = {};

  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];
  searchText = '';

  date = new DatePipe('en-PH');
  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.service.GetMunCity().subscribe((data) => {
      this.MunLoc = <any>data;
      console.log(this.MunLoc);
    });
  }

  onTableDataChange(page: any) {
    //paginate
    console.log(page);
    this.p = page;
    this.Init();
  }
  onTableSizeChange(event: any) {
    //paginate
    this.tableSize = event.target.value;
    this.p = 1;
    this.Init();
  }

  // for modal
  updateM() {
    this.editmodal.longtitude = this.gmapComponent.markers.lng;
    this.editmodal.latitude = this.gmapComponent.markers.lat;
    this.service
      .UpdateMunCity(this.editmodal)
      .subscribe({ next: (_data) => {} });

    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Your work has been updated',
      showConfirmButton: false,
      timer: 1000,
    });
    this.Init();
    this.editmodal = {};
  }

  markerObj: any = {};
  SetMarker(data: any = {}) {
    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.munCityName.charAt(0),
      brgyName: '',
      munCityName: data.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
  }
}
