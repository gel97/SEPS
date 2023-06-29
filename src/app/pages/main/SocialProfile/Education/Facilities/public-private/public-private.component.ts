import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
import { EducationStatService } from 'src/app/shared/SocialProfile/Education/educationStat.service';
@Component({
  selector: 'app-public-private',
  templateUrl: './public-private.component.html',
  styleUrls: ['./public-private.component.css']
})
export class PublicPrivateComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private service: EducationStatService,
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
  list: any = [];
  data: any = {};

  Init() {
    this.GetData();
  }

  GetData() {
    console.log(this.munCityId + ' | ' + this.setYear);

    this.service.GetListEducationStat(this.setYear, this.munCityId).subscribe({
      next: (response) => {
        console.log(response);
        if (response.length > 0) {
          this.data = <any>response[0];
          this.hasData = true;
        } else {
          this.hasData = false;
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
      this.service.AddEducationStat(this.data).subscribe({
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
      Swal.fire(
        'Missing Data!',
        'Please fill out the input fields.',
        'warning'
      );
    }
  }

  EditData() {
    this.data.setYear = this.setYear;
    this.data.munCityId = this.munCityId;

    this.service.EditEducationStat(this.data).subscribe({
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
        this.service.DeleteEducationStat(transId).subscribe((request) => {
          this.Init();
          this.data = {};
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
