import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FedPwdService } from 'src/app/shared/Province/FedPwd.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-fed-pwd',
  templateUrl: './fed-pwd.component.html',
  styleUrls: ['./fed-pwd.component.css'],
})
export class FedPWDComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild('closeMunicipalityBtn') closeMunicipalityBtn!: ElementRef;
  @ViewChild('closeBarangayBtn') closeBarangayBtn!: ElementRef;
  constructor(
    private auth: AuthService,
    private Service: FedPwdService,
    private modifyService: ModifyCityMunService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  munCityName: string = this.auth.munCityName;
  o_munCityId: any = '';
  isPWDBrgy: boolean = true;
  listData: any = [];
  listPWD: any[] = [];
  listPWDBrgy: any = [];
  listMunCity: any = {};
  listDataBrgy: any = [];
  listBarangay: any = [];

  data: any = {};
  isAdd: boolean = false;

  handleOnTabChange(isPWDBrgy: boolean) {
    this.isPWDBrgy = isPWDBrgy;
  }

  ngOnInit(): void {
    this.Init();
    this.GetPWD();
    this.GetBrgyPWD();
  }
  Init() {
    this.GetListMunicipality();
  }
  GetBrgyPWD() {
    this.Service.GetBrgyPWD().subscribe({
      next: (response) => {
        this.listPWDBrgy = <any>response;
        console.log(this.listPWDBrgy);
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
      this.listPWDBrgy.forEach((b: any) => {
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
  GetPWD() {
    {
      this.Service.GetPWD(this.auth.setYear).subscribe({
        next: (response) => {
          this.listPWD = <any>response;
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

    if (!Array.isArray(this.listMunCity) || !Array.isArray(this.listPWD)) {
      console.warn('Either listMunCity or listPWD is not an array yet.');
      return;
    }

    this.listMunCity.forEach((a: any) => {
      this.listPWD.forEach((b: any) => {
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
  AddPWD() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.Service.AddPWD(this.data).subscribe({
        next: (response) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.munCityId === this.data.munCityId
          );
          this.listData[index] = response;
        },
        complete: () => {
          this.GetPWD();
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
  EditPWD() {
    this.data.setYear = this.auth.activeSetYear;
    this.Service.EditPWD(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetPWD(); // ⬅️ Add this
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
  DeletePWD(transId: any, index: any, data: any) {
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
        this.Service.DeletePWD(transId).subscribe({
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
          brgyfemale: number;
        },
        item: {
          brgyMale: any;
          brgyfemale: any;
        }
      ) => {
        acc.brgyMale += item.brgyMale || 0;
        acc.brgyfemale += item.brgyfemale || 0;
        return acc;
      },
      {
        brgyMale: 0,
        brgyfemale: 0,
      }
    );
  }
  AddBrgyPWD() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.Service.AddBrgyPWD(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          this.listData[index] = request;
        },
        complete: () => {
          this.GetBrgyPWD(); // ⬅️ THIS refreshes the list
          this.closeBarangayBtn.nativeElement.click();
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
  EditBrgyPWD() {
    this.data.setYear = this.auth.activeSetYear;
    this.Service.EditBrgyPWD(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetBrgyPWD(); // ⬅️ Add this
        this.closeBarangayBtn.nativeElement.click();
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
  DeleteBrgyPWD(transId: any, index: any, data: any) {
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
        this.Service.DeleteBrgyPWD(transId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
          error: () => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.GetBrgyPWD(); // ⬅️ Re-fetch fresh data list
          },
        });
      }
    });
  }
}
