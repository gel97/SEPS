import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { isEmptyObject } from 'jquery';
import { PostalServicesService } from 'src/app/shared/Infrastructure/Utilities/Communication/postal-services.service';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
@Component({
  selector: 'app-postal-services',
  templateUrl: './postal-services.component.html',
  styleUrls: ['./postal-services.component.css'],
})
export class PostalServicesComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private service: PostalServicesService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  toValidate: any = {};
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void } };
  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  ngOnInit(): void {
    this.Init();
  }
  munCityId: string = this.auth.munCityId;
  setYear: string = this.auth.setYear;

  isAdd: boolean = true;
  hasData: boolean = false;
  data: any = {};

  Init() {
    this.GetData();
  }

  message = 'Postal Service Facilities';

  viewData: boolean = false;
  parentMethod() {
    // alert('parent Method');
    this.viewData = true;
  }

  GetData() {
    this.service.GetPostal(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        console.log(response);
        if (response !== null) {
          this.data = <any>response;
          this.hasData = true;
          this.viewData = true;
        } else {
          this.hasData = false;
          this.viewData = false;
        }
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {},
    });
  }

  AddData() {
    if (!isEmptyObject(this.data)) {
      this.data.setYear = this.setYear;
      this.data.munCityId = this.munCityId;

      this.service.AddPostal(this.data).subscribe({
        next: (request) => {
          this.GetData();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          if (!this.isCheck) {
            this.closebutton.nativeElement.click();
          }
          this.data = {};
          Swal.fire('Good job!', 'Data Added Successfully!', 'success');
        },
      });
    } else {
      Swal.fire('Empty Fields.', 'Please fill out the input fields', 'warning');
    }
  }

  EditData() {
    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    this.service.EditPostal(this.data).subscribe({
      next: (request) => {
        this.GetData();
      },
      error: (error) => {
        Swal.fire('Oops!', 'Something went wrong.', 'error');
      },
      complete: () => {
        this.closebutton.nativeElement.click();
        Swal.fire('Good job!', 'Data Updated Successfully!', 'success');
      },
    });
  }

  DeleteData(transId: any) {
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
        this.service.DeletePostal(transId).subscribe((request) => {
          this.Init();
          this.data = {};
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
