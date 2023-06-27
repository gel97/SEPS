import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { TrasportationService } from 'src/app/shared/Trasportation/trasportation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css'],
})
export class RoadsComponent implements OnInit {
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

  message = 'Roads';

  parentMethod() {
    // alert('parent Method');
    this.isNew = true;
  }

  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  TranspoRoadList: any = [];
  RoadList: any = {};
  isNew: boolean = true;

  RoadType: any = [
    { id: 'rt01', roadtypename: 'National Roads' },
    { id: 'rt02', roadtypename: 'Provincial Roads' },
    { id: 'rt03', roadtypename: 'Municipal/City Roads' },
    { id: 'rt04', roadtypename: 'Barangay Roads' },
    { id: 'rt05', roadtypename: 'NIA Roads' },
    { id: 'rt06', roadtypename: 'Expressways/Toll Roads' },
    { id: 'rt07', roadtypename: 'Private Industrial Roads' },
    { id: 'rt08', roadtypename: 'Private Subdivision Roads' },
    { id: 'rt09', roadtypename: 'Other/Unspecified' },
  ];

  ngOnInit(): void {
    this.getListTranspoRoad();
  }

  getListTranspoRoad() {
    this.service.get_list_transpo_road().subscribe((data) => {
      this.TranspoRoadList = <any>data;
      // if (this.TranspoRoadList.length > 0) {
      //   this.isNew = true;
      // } else {
      //   this.isNew = false;
      // }
      for (let i of this.TranspoRoadList) {
        for (let r of this.RoadType) {
          if (i.roadType == r.id) {
            i.roadtypename = r.roadtypename;
            break;
          }
        }
      }
    });
  }

  saveRoadList() {
    this.toValidate.roadType =
      this.RoadList.roadType == '' || this.RoadList.roadType == null
        ? true
        : false;
    this.toValidate.concrete =
      this.RoadList.concrete == '' || this.RoadList.concrete == undefined
        ? true
        : false;
    this.toValidate.asphalt =
      this.RoadList.asphalt == '' || this.RoadList.asphalt == null
        ? true
        : false;
    this.toValidate.gravel =
      this.RoadList.gravel == '' || this.RoadList.gravel == undefined
        ? true
        : false;
    this.toValidate.earth =
      this.RoadList.earth == '' || this.RoadList.earth == undefined
        ? true
        : false;

    this.RoadList.setYear = this.auth.activeSetYear;
    this.RoadList.munCityId = this.auth.munCityId;
    this.RoadList.tag = 1;
    this.RoadList.totalLength = String(
      Number(this.RoadList.concrete) +
        Number(this.RoadList.asphalt) +
        Number(this.RoadList.gravel) +
        Number(this.RoadList.earth)
    );

    if (
      !this.toValidate.roadType &&
      !this.toValidate.concrete &&
      !this.toValidate.asphalt &&
      !this.toValidate.gravel &&
      !this.toValidate.earth
    ) {
      this.service.post_save_transpo_road(this.RoadList).subscribe(
        (data) => {
          Swal.fire('Saved!', 'Data successfully saved.', 'success');
          this.closebutton.nativeElement.click();
          for (let r of this.RoadType) {
            if ((<any>data).roadType == r.id) {
              (<any>data).roadtypename = r.roadtypename;
              break;
            }
          }

          this.TranspoRoadList.push(<any>data);
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

  updateRoadList() {
    this.toValidate.roadType =
      this.RoadList.roadType == '' || this.RoadList.roadType == null
        ? true
        : false;
    this.toValidate.concrete =
      this.RoadList.concrete == '' || this.RoadList.concrete == undefined
        ? true
        : false;
    this.toValidate.asphalt =
      this.RoadList.asphalt == '' || this.RoadList.asphalt == null
        ? true
        : false;
    this.toValidate.gravel =
      this.RoadList.gravel == '' || this.RoadList.gravel == undefined
        ? true
        : false;
    this.toValidate.earth =
      this.RoadList.earth == '' || this.RoadList.earth == undefined
        ? true
        : false;

    this.RoadList.totalLength = String(
      Number(this.RoadList.concrete) +
        Number(this.RoadList.asphalt) +
        Number(this.RoadList.gravel) +
        Number(this.RoadList.earth)
    );
    if (
      !this.toValidate.roadType &&
      !this.toValidate.concrete &&
      !this.toValidate.asphalt &&
      !this.toValidate.gravel &&
      !this.toValidate.earth
    ) {
      this.service.put_update_transpo_road(this.RoadList).subscribe(
        (data) => {
          Swal.fire('Updated!', 'Data successfully updated.', 'success');
          this.closebutton.nativeElement.click();
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

  deleteRoadList(transId: any = '', index: any = '') {
    this.service.delete_transpo_road(transId).subscribe(
      (data) => {
        Swal.fire('Deleted!', 'Data successfully deleted.', 'success');
        this.TranspoRoadList.splice(index, 1);
      },
      (err) => {
        alert('ERROR');
      }
    );
  }
}
