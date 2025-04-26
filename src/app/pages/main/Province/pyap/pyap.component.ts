import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PyapService } from 'src/app/shared/Province/PYAP.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-pyap',
  templateUrl: './pyap.component.html',
  styleUrls: ['./pyap.component.css'],
})
export class PYAPComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild('closeMunicipalityBtn') closeMunicipalityBtn!: ElementRef;
  @ViewChild('closeBarangayBtn') closeBarangayBtn!: ElementRef;
  constructor(
    private auth: AuthService,
    private Service: PyapService,
    private modifyService: ModifyCityMunService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  munCityName: string = this.auth.munCityName;
  o_munCityId: any = '';
  isPYABrgy: boolean = true;
  listData: any = [];
  listDataBrgy: any = [];
  listMunCity: any = {};
  listPYAP: any[] = [];
  listPYAPBrgy: any = [];
  listBarangay: any = [];

  data: any = {};
  isAdd: boolean = false;

  handleOnTabChange(isPYABrgy: boolean) {
    this.isPYABrgy = isPYABrgy;
  }

  ngOnInit(): void {
    this.Init();
    this.GetPYA();
    this.GetBrgyPYAP();
  }
  Init() {
    this.GetListMunicipality();
  }
  GetBrgyPYAP() {
    this.Service.GetBrgyPYAP().subscribe({
      next: (response) => {
        this.listPYAPBrgy = <any>response;
        console.log(this.listPYAPBrgy);
      },
      error: (error) => {
        console.error('Error fetching phy geo brgy', error);
      },
      complete: () => {
        this.GetListBarangay();
      },
    });
  }
  GetListBarangay() {
    this.Service.ListOfBarangay(this.auth.munCityId).subscribe({
      next: (response) => {
        this.listBarangay = <any>response;
        this.FilterList2();
      },
      error: (error) => {
        console.error('Error fetching barangay list', error);
      },
    });
  }
  FilterList2() {
    let isExist;
    this.listDataBrgy = [];

    this.listBarangay.forEach((a: any) => {
      this.listPYAPBrgy.forEach((b: any) => {
        if (a.brgyId == b.brgyId) {
          isExist = this.listDataBrgy.filter((x: any) => x.brgyId == a.brgyId);
          if (isExist.length == 0) {
            this.listDataBrgy.push(b);
          }
        }
      });

      isExist = this.listDataBrgy.filter((x: any) => x.brgyId == a.brgyId);
      if (isExist.length == 0) {
        this.listDataBrgy.push({
          brgyId: a.brgyId,
          brgyName: a.brgyName,
        });
      }
    });
  }
  GetPYA() {
    {
      this.Service.GetPYA(this.auth.setYear).subscribe({
        next: (response) => {
          this.listPYAP = <any>response;
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

    if (!Array.isArray(this.listMunCity) || !Array.isArray(this.listPYAP)) {
      console.warn('Either listMunCity or listPYAP is not an array yet.');
      return;
    }

    this.listMunCity.forEach((a: any) => {
      this.listPYAP.forEach((b: any) => {
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
        },
        item: {
          male: any;
          female: any;
        }
      ) => {
        acc.male += item.male || 0;
        acc.female += item.female || 0;
        return acc;
      },
      {
        male: 0,
        female: 0,
      }
    );
  }
  AddPYA() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.Service.AddPYA(this.data).subscribe({
        next: (response) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.munCityId === this.data.munCityId
          );
          this.listData[index] = response;
        },
        complete: () => {
          this.GetPYA();
          this.closeMunicipalityBtn.nativeElement.click();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been updated',
            showConfirmButton: false,
            timer: 1000,
          });
        },
      });
    }
  }
  EditPYA() {
    this.data.setYear = this.auth.activeSetYear;
    this.Service.EditPYA(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetPYA(); // ⬅️ Add this
        this.closeMunicipalityBtn.nativeElement.click();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }
  DeletePYA(transId: any, index: any, data: any) {
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
        this.Service.DeletePYA(transId).subscribe({
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

  //Barangay
  get total() {
    return this.listDataBrgy.reduce(
      (
        acc: {
          brgyMale: number;
          brgyFemale: number;
        },
        item: {
          brgyMale: any;
          brgyFemale: any;
        }
      ) => {
        acc.brgyMale += item.brgyMale || 0;
        acc.brgyFemale += item.brgyFemale || 0;
        return acc;
      },
      {
        brgyMale: 0,
        brgyFemale: 0,
      }
    );
  }
  AddBrgyPYAP() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.Service.AddBrgyPYAP(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          this.listData[index] = request;
        },
        complete: () => {
          this.GetBrgyPYAP(); // ⬅️ THIS refreshes the list
          this.closeBarangayBtn.nativeElement.click();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been updated',
            showConfirmButton: false,
            timer: 1000,
          });
        },
      });
    }
  }
  EditBrgyPYAP() {
    this.data.setYear = this.auth.activeSetYear;
    this.Service.EditBrgyPYAP(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetBrgyPYAP(); // ⬅️ Add this
        this.closeBarangayBtn.nativeElement.click();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been updated',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }
  DeleteBrgyPYAP(transId: any, index: any, data: any) {
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
        this.Service.DeleteBrgyPYAP(transId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
          error: () => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.GetBrgyPYAP(); // ⬅️ Re-fetch fresh data list
          },
        });
      }
    });
  }
}
