import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { TrasportationService } from 'src/app/shared/Trasportation/trasportation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-transport-terminals',
  templateUrl: './transport-terminals.component.html',
  styleUrls: ['./transport-terminals.component.css'],
})
export class TransportTerminalsComponent implements OnInit {
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(
    private service: TrasportationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  
  munCityName: string = this.auth.munCityName;
  TranspoTerminalList: any = [];
  TerminalList: any = {};
  BarangayList: any = [];
  isNew: boolean = true;
  toValidate: any = {};

  TransportType: any = [
    { id: 101, transpotypename: 'Bus' },
    { id: 102, transpotypename: 'Jeepney' },
    { id: 103, transpotypename: 'Van/FX-UV/GT Express' },
    { id: 104, transpotypename: 'Tricycle' },
    { id: 105, transpotypename: 'Pedicab' },
    { id: 106, transpotypename: 'Single Motorcycle' },
    { id: 107, transpotypename: 'Others' },
  ];

  ngOnInit(): void {
    this.getListTranspoTerminal();
  }

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

  getListTranspoTerminal() {
    this.service.get_list_barangay().subscribe((data) => {
      this.BarangayList = <any>data;
    });

    this.service.get_list_transpo_terminal().subscribe((data) => {
      this.TranspoTerminalList = <any>data;

      for (let i of this.TranspoTerminalList) {
        for (let t of this.TransportType) {
          if (i.transportType == t.id) {
            i.transpotypename = t.transpotypename;
            break;
          }
        }
      }
    });
  }

  saveTerminalList() {
    this.toValidate.company =
      this.TerminalList.company == '' || this.TerminalList.company == undefined
        ? true
        : false;
    this.toValidate.transportType =
      this.TerminalList.transportType == '' ||
      this.TerminalList.transportType == null
        ? true
        : false;
    this.toValidate.unitsNo =
      this.TerminalList.unitsNo == '' || this.TerminalList.unitsNo == undefined
        ? true
        : false;
    this.toValidate.routes =
      this.TerminalList.routes == '' || this.TerminalList.routes == null
        ? true
        : false;

    this.TerminalList.setYear = Number(this.auth.activeSetYear);
    this.TerminalList.tag = 1;
    this.TerminalList.transportType = Number(this.TerminalList.transportType);
    console.log(this.TerminalList);
    if (
      !this.toValidate.company &&
      !this.toValidate.transportType &&
      !this.toValidate.unitsNo &&
      !this.toValidate.routes
    ) {
      this.service.post_save_transpo_terminal(this.TerminalList).subscribe(
        (data) => {
          Swal.fire('Saved!', 'Data successfully saved.', 'success');
          for (let t of this.TransportType) {
            if ((<any>data).transportType == t.id) {
              (<any>data).transpotypename = t.transpotypename;
              break;
            }
          }
          this.TranspoTerminalList.push(<any>data);
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

  updateTerminalList() {
    this.toValidate.company =
      this.TerminalList.company == '' || this.TerminalList.company == undefined
        ? true
        : false;
    this.toValidate.transportType =
      this.TerminalList.transportType == '' ||
      this.TerminalList.transportType == null
        ? true
        : false;
    this.toValidate.unitsNo =
      this.TerminalList.unitsNo == '' || this.TerminalList.unitsNo == undefined
        ? true
        : false;
    this.toValidate.routes =
      this.TerminalList.routes == '' || this.TerminalList.routes == null
        ? true
        : false;

    this.TerminalList.longtitude = this.gmapComponent.markers.lng;
    this.TerminalList.latitude = this.gmapComponent.markers.lat;
    if (
      !this.toValidate.company &&
      !this.toValidate.transportType &&
      !this.toValidate.unitsNo &&
      !this.toValidate.routes
    ) {
      this.service.put_update_transpo_terminal(this.TerminalList).subscribe(
        (data) => {
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

  deleteTerminalList(transId: any = '', index: any = '') {
    this.service.delete_transpo_terminal(transId).subscribe(
      (data) => {
        Swal.fire('Deleted!', 'Data successfully deleted.', 'success');
        this.TranspoTerminalList.splice(index, 1);
      },
      (err) => {
        alert('ERROR');
      }
    );
  }
}
