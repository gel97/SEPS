import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { HealthProfileService } from 'src/app/shared/SocialProfile/Health/healthProfile.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { SafetyIndexService } from 'src/app/shared/SocialProfile/PublicOrder/safety-index.service';
@Component({
  selector: 'app-index-crime',
  templateUrl: './index-crime.component.html',
  styleUrls: ['./index-crime.component.css']
})
export class IndexCrimeComponent implements OnInit {
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };
  constructor(
    private auth: AuthService,
    private service: SafetyIndexService,
    private modifyService: ModifyCityMunService
  ) {
    this.o_munCityId = this.auth.o_munCityId;
  }

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }
  

  munCityName: string = this.auth.munCityName;
  is_update: boolean = false;
  listHealthProf: any = [];
  barangay: any = {};
  addmodal: any = {};
  editmodal: any = {};
  UpdateBarangay: any = {};
  listMunCity: any = {};

  pageSize = 25;
  p: string | number | undefined;
  count: number = 0;
  tableSize: number = 5;
  tableSizes: any = [5, 10, 15, 25, 50, 100];

  isAdd: boolean = false;
  listData: any = [];
  data: any = {};
  o_munCityId:any =""

  ngOnInit(): void {
    this.Init();
  }

  Init() {
    this.GetData();
    this.GetListMunicipality();
  }

  GetData() {
    this.service.GetListSafetyIndex(this.auth.setYear).subscribe({
      next: (response) => {
        this.listHealthProf = (<any>response);
      },
      error: (error) => {
      },
      complete: () => {
        this.GetListMunicipality();
      }
    });
  }

  GetListMunicipality() {
    this.service.ListOfMunicipality().subscribe({
      next: (response) => {
        this.listMunCity = (<any>response);
      },
      error: (error) => {
      },
      complete: () => {
        this.FilterList();
      }
    });
  }

  FilterList() {
    let isExist;
    this.listData = [];

    this.listMunCity.forEach((a: any) => {
      this.listHealthProf.forEach((b: any) => {
        if (a.munCityId == b.munCityId) {
          isExist = this.listData.filter((x: any) => x.munCityId == a.munCityId);
          if (isExist.length == 0) {
            this.listData.push(b);
          }
        }
      });

      isExist = this.listData.filter((x: any) => x.munCityId == a.munCityId);
      if (isExist.length == 0) {
        this.listData.push({
          'munCityId': a.munCityId,
          'munCityName': a.munCityName
        });
      } 
    });
  }

  AddData() {
    if(isEmptyObject(this.data)){
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    }
    else{
      this.data.munCityId = this.auth.munCityId;
      this.data.setYear = this.auth.activeSetYear;
      this.service.AddSafetyIndex(this.data).subscribe({
        next: (request) => {
          let index = this.listData.findIndex((obj: any) => obj.munCityId === this.data.munCityId);
          this.listData[index] = request;
        },
        complete: () => {
          this.data = {};
          this.closebutton.nativeElement.click();

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Your work has been saved',
            showConfirmButton: false,
            timer: 1000
          });
        }
      });
    }
  }

  EditData() {
      this.data.setYear = this.auth.activeSetYear;
      this.service.EditSafetyIndex(this.data).subscribe({
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
            timer: 1000
          });
        }
      });
}

DeleteData(transId: any, index: any, data:any) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.service.DeleteSafetyIndex(transId).subscribe({
        next: (_data) => {
        },
        error: (err) => {
          Swal.fire(
            'Oops!',
            'Something went wrong.',
            'error'
          )
        },
        complete: () => {
          this.listData[index] = {};
          this.listData[index].munCityId = data.munCityId;
          this.listData[index].munCityName = data.munCityName;
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        }

      });

    }
  })
}

}
