import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { RegSeniorService } from 'src/app/shared/Province/RegSenior.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-reg-senior',
  templateUrl: './reg-senior.component.html',
  styleUrls: ['./reg-senior.component.css'],
})
export class RegSeniorComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild('closeMunicipalityBtn') closeMunicipalityBtn!: ElementRef;
  @ViewChild('closeBarangayBtn') closeBarangayBtn!: ElementRef;
  constructor(
    private auth: AuthService,
    private Service: RegSeniorService,
    private modifyService: ModifyCityMunService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }
  munCityName: string = this.auth.munCityName;
  o_munCityId: any = '';
  listData: any = [];
  listMunCity: any = {};
  listRegSen: any[] = [];
  data: any = {};
  list_sep_year: any[] = [];
  isAdd: boolean = false;

  ngOnInit(): void {
    this.Init();
    this.GetRegSenior();
  }
  Init() {
    this.GetListMunicipality();
  }
  GetRegSenior() {
    {
      this.Service.GetRegSenior(this.auth.setYear).subscribe({
        next: (response) => {
          this.listRegSen = <any>response;
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
  get setYear() {
    return this.auth.setYear || this.auth.activeSetYear;
  }

  FilterList() {
    let isExist;
    this.listData = [];

    if (!Array.isArray(this.listMunCity) || !Array.isArray(this.listRegSen)) {
      console.warn('Either listMunCity or listPYAP is not an array yet.');
      return;
    }

    this.listMunCity.forEach((a: any) => {
      this.listRegSen.forEach((b: any) => {
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
          male: number;
          female: number;
          pensioner: number;
        },
        item: {
          male: any;
          female: any;
          pensioner: any;
        }
      ) => {
        acc.male += item.male || 0;
        acc.female += item.female || 0;
        acc.pensioner += item.pensioner || 0;
        return acc;
      },
      {
        male: 0,
        female: 0,
        pensioner: 0,
      }
    );
  }
  get total() {
    return this.listData.reduce(
      (
        acc: {
          male: number;
          female: number;
          pensioner: number;
        },
        item: {
          male: any;
          female: any;
          pensioner: any;
        }
      ) => {
        acc.male += item.male || 0;
        acc.female += item.female || 0;
        acc.pensioner += item.pensioner || 0;
        return acc;
      },
      {
        male: 0,
        female: 0,
        pensioner: 0,
      }
    );
  }
  AddRegSenior() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.Service.AddRegSenior(this.data).subscribe({
        next: (response) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.munCityId === this.data.munCityId
          );
          this.listData[index] = response;
        },
        complete: () => {
          this.GetRegSenior();
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
  EditRegSenior() {
    this.data.setYear = this.auth.activeSetYear;
    this.Service.EditRegSenior(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetRegSenior(); // ⬅️ Add this
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
  DeleteRegSenior(transId: any, index: any, data: any) {
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
        this.Service.DeleteRegSenior(transId).subscribe({
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
