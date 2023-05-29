import { MunCityLocService } from './../../../../shared/Governance/mun-city-loc.service';
import { CityOfficialService } from '../../../../shared/Governance/city-official.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { GeoProfileService } from 'src/app/shared/Governance/geo-profile.service';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';

@Component({
  selector: 'app-geo-profile',
  templateUrl: './geo-profile.component.html',
  styleUrls: ['./geo-profile.component.css'],
})
export class GeoProfileComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(
    private service: GeoProfileService,
    private gmap: MunCityLocService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  
  munCityName: string = this.auth.munCityName;

  ViewGeo: any = [];
  geo: any = {};
  updategeo: any = {};
  inputDisabled: boolean = false;
  editgeo: any = {};
  toValidate: any = {};
  isAdd: boolean = true;
  MunLoc: any = [];
  munCity: any = {};

  date = new DatePipe('en-PH');

  ngOnInit(): void {
    this.GmapLocation();
    this.Init();
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);

    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: null,
      brgyName: null,
      munCityName: null,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
  }

  Init() {
    this.service.GetGeo().subscribe((data) => {
      this.ViewGeo = <any>data;
      //textfield(enable/disabled)
      this.inputDisabled = this.ViewGeo != null ? true : false;

      if (this.ViewGeo !== null) {
        this.geo = this.ViewGeo;
      }
      console.log(this.ViewGeo);
    });
  }

  GmapLocation() {
    this.gmap.GetMunCity().subscribe({
      next: (response) => {
        this.MunLoc = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.munCity = this.MunLoc.find(
          (a: { munCityId: any }) => a.munCityId == this.auth.munCityId
        );
        // this.SetMarker(this.munCity);
        // console.log(this.munCity);
      },
    });
  }

  AddGeo() {
    this.toValidate.totalLandArea =
      this.geo.totalLandArea == '' || this.geo.totalLandArea == null
        ? true
        : false;
    this.toValidate.setYear =
      this.geo.setYear == '' || this.geo.setYear == undefined ? true : false;
    this.toValidate.residential =
      this.geo.residential == '' || this.geo.residential == undefined
        ? true
        : false;
    this.toValidate.commercial =
      this.geo.commercial == '' || this.geo.commercial == undefined
        ? true
        : false;
    this.toValidate.industrial =
      this.geo.industrial == '' || this.geo.industrial == null ? true : false;
    this.toValidate.agricultural =
      this.geo.agricultural == '' || this.geo.agricultural == undefined
        ? true
        : false;
    this.toValidate.institutional =
      this.geo.institutional == '' || this.geo.institutional == undefined
        ? true
        : false;
    this.toValidate.forestLand =
      this.geo.forestLand == '' || this.geo.forestLand == undefined
        ? true
        : false;
    this.toValidate.openSpaces =
      this.geo.openSpaces == '' || this.geo.openSpaces == null ? true : false;
    this.toValidate.fishpond =
      this.geo.fishpond == '' || this.geo.fishpond == undefined ? true : false;
    this.toValidate.quarryAreas =
      this.geo.quarryAreas == '' || this.geo.quarryAreas == undefined
        ? true
        : false;
    this.toValidate.otherUses =
      this.geo.otherUses == '' || this.geo.otherUses == undefined
        ? true
        : false;
    this.toValidate.reclassified =
      this.geo.reclassified == '' || this.geo.reclassified == null
        ? true
        : false;

    if (
      this.toValidate.totalLandArea == true ||
      this.toValidate.setYear == true ||
      this.toValidate.residential == true ||
      this.toValidate.commercial == true ||
      this.toValidate.industrial == true ||
      this.toValidate.agricultural == true ||
      this.toValidate.institutional == true ||
      this.toValidate.forestLand == true ||
      this.toValidate.openSpaces == true ||
      this.toValidate.fishpond == true ||
      this.toValidate.quarryAreas == true ||
      this.toValidate.otherUses == true ||
      this.toValidate.reclassified == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.geo.munCityId = this.auth.munCityId;
      this.geo.setYear = this.auth.activeSetYear;
      this.service.AddGeoP(this.geo).subscribe(
        (_data) => {
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          this.Init();
          this.geo = {};
        },
        (_err) => {
          Swal.fire('ERROR!', 'Error', 'error');
          this.Init();
          this.geo = {};
        }
      );
    }
  }

  editgeoprof(editgeoprof: any = {}) {
    this.editgeo = editgeoprof;
    //passing the data from table (modal)
    this.Init();
  }

  //for modal
  update_Geo() {
    this.toValidate.totalLandArea =
      this.geo.totalLandArea == '' || this.geo.totalLandArea == null
        ? true
        : false;
    this.toValidate.setYear =
      this.geo.setYear == '' || this.geo.setYear == undefined ? true : false;
    this.toValidate.residential =
      this.geo.residential == '' || this.geo.residential == undefined
        ? true
        : false;
    this.toValidate.commercial =
      this.geo.commercial == '' || this.geo.commercial == undefined
        ? true
        : false;
    this.toValidate.industrial =
      this.geo.industrial == '' || this.geo.industrial == null ? true : false;
    this.toValidate.agricultural =
      this.geo.agricultural == '' || this.geo.agricultural == undefined
        ? true
        : false;
    this.toValidate.institutional =
      this.geo.institutional == '' || this.geo.institutional == undefined
        ? true
        : false;
    this.toValidate.forestLand =
      this.geo.forestLand == '' || this.geo.forestLand == undefined
        ? true
        : false;
    this.toValidate.openSpaces =
      this.geo.openSpaces == '' || this.geo.openSpaces == null ? true : false;
    this.toValidate.fishpond =
      this.geo.fishpond == '' || this.geo.fishpond == undefined ? true : false;
    this.toValidate.quarryAreas =
      this.geo.quarryAreas == '' || this.geo.quarryAreas == undefined
        ? true
        : false;
    this.toValidate.otherUses =
      this.geo.otherUses == '' || this.geo.otherUses == undefined
        ? true
        : false;
    this.toValidate.reclassified =
      this.geo.reclassified == '' || this.geo.reclassified == null
        ? true
        : false;

    if (
      this.toValidate.totalLandArea == true ||
      this.toValidate.setYear == true ||
      this.toValidate.residential == true ||
      this.toValidate.commercial == true ||
      this.toValidate.industrial == true ||
      this.toValidate.agricultural == true ||
      this.toValidate.institutional == true ||
      this.toValidate.forestLand == true ||
      this.toValidate.openSpaces == true ||
      this.toValidate.fishpond == true ||
      this.toValidate.quarryAreas == true ||
      this.toValidate.otherUses == true ||
      this.toValidate.reclassified == true
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.service.UpdateGeo(this.editgeo).subscribe({
        next: (_data) => {
          this.Init();
        },
      });
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Your work has been updated',
        showConfirmButton: false,
        timer: 1000,
      });
      document.getElementById('exampleModalLong')?.click();
      this.editgeo = {};
    }
  }

  delete(transId: any) {
    Swal.fire({
      text: 'Do you want to remove this file',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Delete(transId).subscribe({
          next: (_data) => {
            this.Init();
          },
          error: (err) => {
            this.Init();
            this.geo = {};
          },
        });
        Swal.fire('Deleted!', 'Your file has been removed.', 'success');
      }
    });
  }
}
