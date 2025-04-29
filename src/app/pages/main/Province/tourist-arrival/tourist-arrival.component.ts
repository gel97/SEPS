import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TourismArrivalService } from 'src/app/shared/Province/TourismArrival.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-tourist-arrival',
  templateUrl: './tourist-arrival.component.html',
  styleUrls: ['./tourist-arrival.component.css'],
})
export class TouristArrivalComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild('closeMunicipalityBtn') closeMunicipalityBtn!: ElementRef;
  @ViewChild('closeBarangayBtn') closeBarangayBtn!: ElementRef;
  constructor(
    private auth: AuthService,
    private Service: TourismArrivalService,
    private modifyService: ModifyCityMunService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  munCityName: string = this.auth.munCityName;
  o_munCityId: any = '';
  listData: any = [];
  listMunCity: any = {};
  listArrival: any[] = [];
  data: any = {};
  isAdd: boolean = false;
  ngOnInit(): void {
    this.Init();
    this.GetArrival();
  }
  Init() {
    this.GetListMunicipality();
  }
  get totals() {
    return this.listData.reduce(
      (
        acc: {
          arrival: number;
          totalSpending: number;
        },
        item: {
          arrival: any;
          totalSpending: any;
        }
      ) => {
        acc.arrival += item.arrival || 0;
        acc.totalSpending += item.totalSpending || 0;
        return acc;
      },
      {
        arrival: 0,
        totalSpending: 0,
      }
    );
  }
  GetArrival() {
    {
      this.Service.GetArrival(this.auth.setYear).subscribe({
        next: (response) => {
          this.listArrival = <any>response;
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

    if (!Array.isArray(this.listMunCity) || !Array.isArray(this.listArrival)) {
      console.warn('Either listMunCity or listPYAP is not an array yet.');
      return;
    }

    this.listMunCity.forEach((a: any) => {
      this.listArrival.forEach((b: any) => {
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
  AddArrival() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.Service.AddArrival(this.data).subscribe({
        next: (response) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.munCityId === this.data.munCityId
          );
          this.listData[index] = response;
        },
        complete: () => {
          this.GetArrival();
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
  EditArrival() {
    this.data.setYear = this.auth.activeSetYear;
    this.Service.EditArrival(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetArrival(); // ⬅️ Add this
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
  DeleteArrival(transId: any, index: any, data: any) {
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
        this.Service.DeleteArrival(transId).subscribe({
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
