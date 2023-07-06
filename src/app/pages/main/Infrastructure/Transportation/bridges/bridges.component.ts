import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { TrasportationService } from 'src/app/shared/Trasportation/trasportation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bridges',
  templateUrl: './bridges.component.html',
  styleUrls: ['./bridges.component.css'],
})
export class BridgesComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(
    private service: TrasportationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Bridges';

  parentMethod() {
    // alert('parent Method');
    this.isNew = true;
  }

  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  TranspoBridgeList: any = [];
  BridgeList: any = {};
  BarangayList: any = [];
  isNew: boolean = true;

  ngOnInit(): void {
    this.getListTranspoBridge();
  }
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log('lnglat: ', data.longtitude + ' , ' + data.latitude);

    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true,
    };
    this.gmapComponent.setMarker(this.markerObj);
  }

  getListTranspoBridge() {
    this.service.get_list_barangay().subscribe((data) => {
      this.BarangayList = <any>data;
    });

    this.service.get_list_transpo_bridge().subscribe((data) => {
      this.TranspoBridgeList = <any>data;
    });
  }

  saveBridgeList() {
    this.toValidate.name =
      this.BridgeList.name == '' || this.BridgeList.name == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.BridgeList.brgyId == '' || this.BridgeList.brgyId == null
        ? true
        : false;
    this.toValidate.condition =
      this.BridgeList.condition == '' || this.BridgeList.condition == undefined
        ? true
        : false;
    this.toValidate.pavement =
      this.BridgeList.pavement == '' || this.BridgeList.pavement == null
        ? true
        : false;

    this.BridgeList.setYear = this.setYear;
    this.BridgeList.munCityId = this.munCityId;
    this.BridgeList.tag = 1;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.condition &&
      !this.toValidate.pavement
    ) {
      this.service.post_save_transpo_bridge(this.BridgeList).subscribe(
        (data) => {
          Swal.fire('Saved!', 'Data successfully saved.', 'success');
          this.closebutton.nativeElement.click();
          this.TranspoBridgeList.push(<any>data);
        },
        (error) => {
          alert('ERROR');
        }
      );
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  updateBridgeList() {
    this.toValidate.name =
      this.BridgeList.name == '' || this.BridgeList.name == undefined
        ? true
        : false;
    this.toValidate.brgyId =
      this.BridgeList.brgyId == '' || this.BridgeList.brgyId == null
        ? true
        : false;
    this.toValidate.condition =
      this.BridgeList.condition == '' || this.BridgeList.condition == undefined
        ? true
        : false;
    this.toValidate.pavement =
      this.BridgeList.pavement == '' || this.BridgeList.pavement == null
        ? true
        : false;

    this.BridgeList.longtitude = this.gmapComponent.markers.lng;
    this.BridgeList.latitude = this.gmapComponent.markers.lat;

    if (
      !this.toValidate.name &&
      !this.toValidate.brgyId &&
      !this.toValidate.condition &&
      !this.toValidate.pavement
    ) {
      this.service.put_update_transpo_bridge(this.BridgeList).subscribe(
        (data) => {
          this.closebutton.nativeElement.click();
          Swal.fire('Updated!', 'Data successfully updated.', 'success');
        },
        (err) => {
          alert('ERROR');
        }
      );
    } else {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
      );
    }
  }

  deleteBridgeList(transId: any = '', index: any = '') {
    this.service.delete_transpo_bridge(transId).subscribe(
      (data) => {
        Swal.fire('Deleted!', 'Data successfully deleted.', 'success');
        this.TranspoBridgeList.splice(index, 1);
      },
      (err) => {
        alert('ERROR');
      }
    );
  }
}
