import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ProvIncomeService } from 'src/app/shared/Province/ProvIncome.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-prov-income',
  templateUrl: './prov-income.component.html',
  styleUrls: ['./prov-income.component.css'],
})
export class ProvIncomeComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  @ViewChild('closeMunicipalityBtn') closeMunicipalityBtn!: ElementRef;
  @ViewChild('closeBarangayBtn') closeBarangayBtn!: ElementRef;
  constructor(
    private auth: AuthService,
    private service: ProvIncomeService,
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
  listIncome: any = [];
  data: any = {};
  isAdd: boolean = false;
  listMunCity: any = {};

  ngOnInit(): void {
    this.Init();
  }
  Init() {
    this.GetIncome();
    this.GetListMunicipality();
  }
  GetIncome() {
    this.service.GetIncome(this.auth.setYear).subscribe({
      next: (response) => {
        this.listIncome = <any>response;
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
  FilterList() {
    let isExist;
    this.listData = [];

    this.listMunCity.forEach((a: any) => {
      this.listIncome.forEach((b: any) => {
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
    const result = this.listData.reduce(
      (
        acc: {
          aff: number;
          mq: number;
          m: number;
          egsacs: number;
          wsswm: number;
          c: number;
          wrtrmvm: number;
          ts: number;
          afsa: number;
          ic: number;
          fia: number;
          rea: number;
          psta: number;
          assa: number;
          e: number;
          hhswa: number;
          aer: number;
          osa: number;
        },
        item: {
          aff: any;
          mq: any;
          m: any;
          egsacs: any;
          wsswm: any;
          c: any;
          wrtrmvm: any;
          ts: any;
          afsa: any;
          ic: any;
          fia: any;
          rea: any;
          psta: any;
          assa: any;
          e: any;
          hhswa: any;
          aer: any;
          osa: any;
        }
      ) => {
        acc.aff += item.aff || 0;
        acc.mq += item.mq || 0;
        acc.m += item.m || 0;
        acc.egsacs += item.egsacs || 0;
        acc.wsswm += item.wsswm || 0;
        acc.c += item.c || 0;
        acc.wrtrmvm += item.wrtrmvm || 0;
        acc.ts += item.ts || 0;
        acc.afsa += item.afsa || 0;
        acc.ic += item.ic || 0;
        acc.fia += item.fia || 0;
        acc.rea += item.rea || 0;
        acc.psta += item.psta || 0;
        acc.assa += item.assa || 0;
        acc.e += item.e || 0;
        acc.hhswa += item.hhswa || 0;
        acc.aer += item.aer || 0;
        acc.osa += item.osa || 0;
        return acc;
      },
      {
        aff: 0,
        mq: 0,
        m: 0,
        egsacs: 0,
        wsswm: 0,
        c: 0,
        wrtrmvm: 0,
        ts: 0,
        afsa: 0,
        ic: 0,
        fia: 0,
        rea: 0,
        psta: 0,
        assa: 0,
        e: 0,
        hhswa: 0,
        aer: 0,
        osa: 0,
      }
    );

    // Now, round every value to 2 decimal places
    for (let key in result) {
      result[key] = parseFloat(result[key].toFixed(2));
    }

    return result;
  }
  formatNumber(value: number) {
    return (value || 0).toFixed(2);
  }

  AddIncome() {
    if (isEmptyObject(this.data)) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddIncome(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex(
            (obj: any) => obj.brgyId === this.data.brgyId
          );
          this.listData[index] = request;
        },
        complete: () => {
          this.GetIncome(); // ⬅️ THIS refreshes the list
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
  EditIncome() {
    this.data.setYear = this.auth.activeSetYear;
    this.service.EditIncome(this.data).subscribe({
      next: (request) => {
        this.data = {};
      },
      complete: () => {
        this.GetIncome(); // ⬅️ Add this
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
  DeleteIncome(transId: any, index: any, data: any) {
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
        this.service.DeleteIncome(transId).subscribe({
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
