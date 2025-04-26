import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ChilDevService } from 'src/app/shared/Province/ChildDev.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';
@Component({
  selector: 'app-child-dev',
  templateUrl: './child-dev.component.html',
  styleUrls: ['./child-dev.component.css'],
})
export class ChildDevComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild('closeMunicipalityBtn') closeMunicipalityBtn!: ElementRef;
  @ViewChild('closeBarangayBtn') closeBarangayBtn!: ElementRef;

  constructor(
    private auth: AuthService,
    private service: ChilDevService,
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
  listDataBrgy: any = [];
  listChildDev: any = [];
  listChildDevBrgy: any = [];
  listMunCity: any = {};
  data: any = {};
  isAdd: boolean = false;
  isChildDEvBrgy: boolean = true;
  listBarangay: any = [];

  ngOnInit(): void {
    this.Init();
  }
  Init() {
    this.GetChilDev();
    this.GetListMunicipality();
    this.GetBrgyChildDev();
  }
  GetChilDev() {
    this.service.GetChilDev(this.auth.setYear).subscribe({
      next: (response) => {
        this.listChildDev = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.GetListMunicipality();
      },
    });
  }
  GetListMunicipality() {
    this.service.ListOfMunicipality().subscribe({
      next: (response) => {
        this.listMunCity = <any>response;
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }
  GetBrgyChildDev() {
    this.service.GetBrgyChildDev().subscribe({
      next: (response) => {
        this.listChildDevBrgy = <any>response;
        console.log(this.listChildDevBrgy);
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
    this.service.ListOfBarangay(this.auth.munCityId).subscribe({
      next: (response) => {
        this.listBarangay = <any>response;
        this.FilterList2();
      },
      error: (error) => {
        console.error('Error fetching barangay list', error);
      },
    });
  }
  handleOnTabChange(isChildDEvBrgy: boolean) {
    this.isChildDEvBrgy = isChildDEvBrgy;
  }
  FilterList2() {
    let isExist;
    this.listDataBrgy = [];

    this.listBarangay.forEach((a: any) => {
      this.listChildDevBrgy.forEach((b: any) => {
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

  FilterList() {
    let isExist;
    this.listData = [];

    this.listMunCity.forEach((a: any) => {
      this.listChildDev.forEach((b: any) => {
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
          noOfChild: number;
          cDmale: number;
          cDfemale: number;
          cSmale: number;
          cSfemale: number;
        },
        item: {
          noOfChild: any;
          cDmale: any;
          cDfemale: any;
          cSmale: any;
          cSfemale: any;
        }
      ) => {
        acc.noOfChild += item.noOfChild || 0;
        acc.cDmale += item.cDmale || 0;
        acc.cDfemale += item.cDfemale || 0;
        acc.cSmale += item.cSmale || 0;
        acc.cSfemale += item.cSfemale || 0;
        return acc;
      },
      {
        noOfChild: 0,
        cDmale: 0,
        cDfemale: 0,
        cSmale: 0,
        cSfemale: 0,
      }
    );
  }

  AddData() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddChilDev(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          this.listData[index] = request;
        },
        complete: () => {
          this.GetChilDev(); // ⬅️ THIS refreshes the list
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
  EditData() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.EditChilDev(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetChilDev(); // ⬅️ Add this
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
  DeleteData(transId: any, index: any, data: any) {
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
        this.service.DeleteChildDev(transId).subscribe({
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
  //Add Barangay Child Dev
  get totals2() {
    return this.listDataBrgy.reduce(
      (
        acc: {
          brgyNoOfChild: number;
          brgyCDmale: number;
          brgyCDfemale: number;
          brgyCSmale: number;
          brgyCSfemale: number;
        },
        item: {
          brgyNoOfChild: any;
          brgyCDmale: any;
          brgyCDfemale: any;
          brgyCSmale: any;
          brgyCSfemale: any;
        }
      ) => {
        acc.brgyNoOfChild += item.brgyNoOfChild || 0;
        acc.brgyCDmale += item.brgyCDmale || 0;
        acc.brgyCDfemale += item.brgyCDfemale || 0;
        acc.brgyCSmale += item.brgyCSmale || 0;
        acc.brgyCSfemale += item.brgyCSfemale || 0;
        return acc;
      },
      {
        brgyNoOfChild: 0,
        brgyCDmale: 0,
        brgyCDfemale: 0,
        brgyCSmale: 0,
        brgyCSfemale: 0,
      }
    );
  }
  AddDataBrgy() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddBrgyChildDev(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          this.listData[index] = request;
        },
        complete: () => {
          this.GetBrgyChildDev(); // ⬅️ THIS refreshes the list
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
  EditDataBrgy() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.EditBrgyChilDev(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetBrgyChildDev(); // ⬅️ Add this
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

  DeleteDataBrgy(transId: any, index: any, data: any) {
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
        this.service.DeleteBrgyChildDev(transId).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
          error: () => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.GetBrgyChildDev(); // ⬅️ Re-fetch fresh data list
          },
        });
      }
    });
  }
}
