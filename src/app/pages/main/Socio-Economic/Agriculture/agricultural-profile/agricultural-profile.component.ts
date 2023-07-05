import { JsonPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { isEmptyObject } from 'jquery';
import { AuthService } from 'src/app/services/auth.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { AgricultureProfileService } from 'src/app/shared/Socio-Economic/Agriculture/agriculturalProfile.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agricultural-profile',
  templateUrl: './agricultural-profile.component.html',
  styleUrls: ['./agricultural-profile.component.css'],
})
export class AgriculturalProfileComponent implements OnInit {
  munCityName: string = this.Auth.munCityName;

  constructor(
    private Auth: AuthService,
    private Service: AgricultureProfileService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  closebutton!: { nativeElement: { click: () => void } };
  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  message = 'General Agricultural Profile';

  Data: boolean = false;
  isAdd: boolean = true;
  toValidate: any = {};
  munCityId: string = this.Auth.munCityId;
  setYear: string = this.Auth.setYear;
  listData: any = [];
  addData: any = {};
  editData: any = {};
  updateData: any = {};
  deleteData: any = {};
  visible: boolean = true;
  not_visible: boolean = true;
  //button_edit: boolean = true;

  ngOnInit(): void {
    this.GetListAgricultureProfile();
  }

  public showOverlay = false;
  importMethod() {
    this.showOverlay = true;
    this.Service.Import().subscribe({
      next: (data) => {
        this.ngOnInit();
      },
      error: (error) => {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'warning',
          title: 'Something went wrong',
        });
      },
      complete: () => {
        this.showOverlay = false;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });

        Toast.fire({
          icon: 'success',
          title: 'Imported Successfully',
        });
      },
    });
  }

  close() {}

  GetListAgricultureProfile() {
    this.Service.GetListAgricultureProfile(
      this.Auth.activeSetYear,
      this.Auth.munCityId
    ).subscribe({
      next: (response) => {
        console.log('all_data', response);
        if (response.length > 0) {
          this.addData = <any>response[0];
          this.viewData = true;
          console.log('data: ', this.addData);

          this.Data = true;
        } else {
          this.Data = false;
          this.viewData = false;
        }
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {},
    });
  }

  viewData: boolean = false;
  parentMethod() {
    // alert('parent Method');
    this.viewData = true;
  }

  AddAgricultureProfile() {
    this.toValidate.riceIrrigTotal =
      this.addData.riceIrrigTotal == '' ||
      this.addData.riceIrrigTotal == undefined
        ? true
        : false;
    this.toValidate.riceRainTotal =
      this.addData.riceRainTotal == '' ||
      this.addData.riceRainTotal == undefined
        ? true
        : false;

    if (
      this.toValidate.riceIrrigTotal == false ||
      this.toValidate.riceRainTotal == false
    ) {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields',
        'warning'
      );
    } else {
      this.addData.munCityId = this.Auth.munCityId;
      this.addData.setYear = this.Auth.activeSetYear;
      this.Service.AddAgricultureProfile(this.addData).subscribe(
        (_data) => {
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
          if (this.isCheck) {
            document.getElementById('mEducation')?.click();
          }
          console.log(_data);
          this.clearData();
          // this.addData();
          this.GetListAgricultureProfile();
        },
        (err) => {
          Swal.fire('ERROR!', 'Error', 'error');

          this.GetListAgricultureProfile();
          this.addData = {};
        }
      );
    }
  }
  clearData() {
    this.addData = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
  }

  EditAgricultureProfile() {
    {
      this.editData.setYear = this.setYear;
      this.editData.munCityId = this.munCityId;
      this.Service.EditAgricultureProfile(this.editData).subscribe({
        next: (request) => {
          this.GetListAgricultureProfile();
          Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
          document.getElementById('mEducation')?.click();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
      });
    }
  }

  DeleteAgricultureProfile(transId: any) {
    {
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
          this.Service.DeleteAgricultureProfile(transId).subscribe(
            (request) => {
              this.GetListAgricultureProfile();
              this.addData = {};
            }
          );
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
        }
      });
    }
  }
}
