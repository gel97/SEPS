import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SlopeService } from 'src/app/shared/Province/Slope.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-slope',
  templateUrl: './slope.component.html',
  styleUrls: ['./slope.component.css'],
})
export class SlopeComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild('closeMunicipalityBtn') closeMunicipalityBtn!: ElementRef;
  @ViewChild('closeBarangayBtn') closeBarangayBtn!: ElementRef;

  constructor(
    private auth: AuthService,
    private Service: SlopeService,
    private modifyService: ModifyCityMunService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }
  munCityName: string = this.auth.munCityName;
  o_munCityId: any = '';
  listData: any = [];
  listMunCity: any = {};
  listSlope: any[] = [];
  data: any = {};
  isAdd: boolean = false;

  ngOnInit(): void {
    this.Init();
    this.GetSlope();
  }
  Init() {
    this.GetListMunicipality();
  }
  GetSlope() {
    {
      this.Service.GetSlope(this.auth.setYear).subscribe({
        next: (response) => {
          this.listSlope = <any>response;
        },
        error: (error) => {},
        complete: () => {
          this.GetListMunicipality();
        },
      });
    }
  }
  GetListMunicipality() {
    this.Service.ListOfMunicipality().subscribe({
      next: (response) => {
        this.listMunCity = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }
  FilterList() {
    let isExist;
    this.listData = [];

    if (!Array.isArray(this.listMunCity) || !Array.isArray(this.listSlope)) {
      console.warn('Either listMunCity or listPYAP is not an array yet.');
      return;
    }

    this.listMunCity.forEach((a: any) => {
      this.listSlope.forEach((b: any) => {
        if (a.munCityId == b.munCityId) {
          isExist = this.listData.filter(
            (x: any) => x.munCityId == a.munCityId
          );
          if (isExist.length == 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.munCityId == a.munCityId);
      if (isExist.length == 0) {
        this.listData.push({
          munCityId: a.munCityId,
          munCityName: a.munCityName,
        });
      }
    });
  }
  get totals() {
    return this.listData.reduce(
      (
        acc: {
          slopeFirst: number;
          slopeSecond: number;
          slopeMountain: number;
          slopeUndulating: number;
          slopeAbove: number;
        },
        item: {
          slopeFirst: any;
          slopeSecond: any;
          slopeMountain: any;
          slopeUndulating: any;
          slopeAbove: any;
        }
      ) => {
        acc.slopeFirst += item.slopeFirst || 0;
        acc.slopeSecond += item.slopeSecond || 0;
        acc.slopeMountain += item.slopeMountain || 0;
        acc.slopeUndulating += item.slopeUndulating || 0;
        acc.slopeAbove += item.slopeAbove || 0;

        return acc;
      },
      {
        slopeFirst: 0,
        slopeSecond: 0,
        slopeMountain: 0,
        slopeUndulating: 0,
        slopeAbove: 0,
      }
    );
  }
  AddSlope() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.Service.AddSlope(this.data).subscribe({
        next: (response) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.munCityId === this.data.munCityId
          );
          this.listData[index] = response;
        },
        complete: () => {
          this.GetSlope();
          this.closeMunicipalityBtn.nativeElement.click();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Good job Data Added Successfully! success',
            showConfirmButton: false,
            timer: 2000,
          });
        },
      });
    }
  }
  EditSlope() {
    this.data.setYear = this.auth.activeSetYear;
    this.Service.EditSlope(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetSlope(); // ⬅️ Add this
        this.closeMunicipalityBtn.nativeElement.click();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 2000,
        });
      },
    });
  }
  DeleteSlope(transId: any, index: any, data: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.Service.DeleteSlope(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {};
            this.listData[index].munCityId = data.munCityId;
            this.listData[index].munCityName = data.munCityName;
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }
}
