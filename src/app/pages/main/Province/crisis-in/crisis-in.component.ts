import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { CrisisInterventionService } from 'src/app/shared/Province/CrisisIntervention.Service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { response } from 'express';

@Component({
  selector: 'app-crisis-in',
  templateUrl: './crisis-in.component.html',
  styleUrls: ['./crisis-in.component.css'],
})
export class CrisisInComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  constructor(
    private auth: AuthService,
    private Service: CrisisInterventionService,
    private modifyService: ModifyCityMunService
  ) {}
  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  munCityName: string = this.auth.munCityName;
  toValidate: any = {};
  isAdd: boolean = false;

  listCrisis: any = [];
  listData: any = [];
  listCrisisTypes: any = [];

  data: any = {};
  reports: any = [];

  ngOnInit(): void {
    this.Init();
  }
  Init() {
    this.GetCrisisIn();
    this.GetListCrisisTypes();
  }
  GetCrisisIn() {
    this.Service.GetCrisisIn(this.auth.setYear, this.auth.munCityId).subscribe({
      next: (response) => {
        this.listCrisis = <any>response;
        console.log('listCrisis:', this.listCrisis);
      },
      error: (error) => {},
      complete: () => {
        this.GetListCrisisTypes();
      },
    });
  }
  GetListCrisisTypes() {
    this.Service.GetListCrisisTypes().subscribe({
      next: (response) => {
        this.listCrisisTypes = <any>response;
        console.log('Course:', this.listCrisisTypes);
      },
      error: (error) => {},
      complete: () => {
        this.FilterList();
      },
    });
  }
  FilterList() {
    this.listData = [];

    this.listCrisisTypes.forEach((type: any) => {
      const matched = this.listCrisis.find(
        (entry: any) => entry.type === type.recNo
      );

      if (matched) {
        // Merge crisis entry with assistance info
        this.listData.push({
          ...matched,
          assistance: type.assistance,
        });
      } else {
        // Type exists but no data yet
        this.listData.push({
          type: type.recNo,
          assistance: type.assistance,
        });
      }
    });

    console.log('Final merged listData:', this.listData);
  }
  get totals() {
    return this.listData.reduce(
      (
        acc: {
          male: number;
          female: number;
          amountExtended: number;
        },
        item: {
          male: any;
          female: any;
          amountExtended: any;
        }
      ) => {
        acc.male += item.male || 0;
        acc.female += item.female || 0;
        acc.amountExtended += item.amountExtended || 0;
        return acc;
      },
      {
        male: 0,
        female: 0,
        amountExtended: 0,
      }
    );
  }

  AddCrisisIn() {
    this.data.setYear = this.auth.activeSetYear;
    this.data.munCityId = this.auth.o_munCityId;

    this.Service.AddCrisisIn(this.data).subscribe({
      next: (request) => {
        // Get the assistance name based on type
        const typeInfo = this.listCrisisTypes.find(
          (t: any) => t.recNo === this.data.type
        );

        const merged = {
          ...request,
          assistance: typeInfo ? typeInfo.assistance : '',
        };

        // Replace or add the item in the listData
        const index = this.listData.findIndex(
          (obj: any) => obj.type === this.data.type
        );

        if (index !== -1) {
          this.listData[index] = merged;
        } else {
          this.listData.push(merged);
        }

        console.log('Updated listData:', this.listData);
      },
      complete: () => {
        this.data = {};
        this.closebutton.nativeElement.click();

        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Your work has been saved',
          showConfirmButton: false,
          timer: 1000,
        });
      },
    });
  }

  EditCrisisIn() {
    this.data.setYear = this.auth.activeSetYear;
    this.Service.EditCrisisIn(this.data).subscribe({
      next: (request) => {
        this.closebutton.nativeElement.click();
        this.data = {};
      },
      complete: () => {
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

  DeleteCrisisIn(transId: any, index: any, data: any) {
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
        this.Service.DeleteCrisisIn(transId).subscribe({
          next: (_data) => {},
          error: (err) => {
            Swal.fire('Oops!', 'Something went wrong.', 'error');
          },
          complete: () => {
            this.listData[index] = {
              type: data.type,
              assistance: data.assistance,
            };
            Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
          },
        });
      }
    });
  }
}
