import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ServiceIrrigationService } from 'src/app/shared/Infrastructure/Utilities/service-irrigation.service';
import { isEmptyObject } from 'jquery';
import { ModifyCityMunService } from 'src/app/services/modify-city-mun.service';
@Component({
  selector: 'app-irrigation-system',
  templateUrl: './irrigation-system.component.html',
  styleUrls: ['./irrigation-system.component.css'],
})
export class IrrigationSystemComponent implements OnInit {
  munCityName: string = this.auth.munCityName;
  constructor(
    private service: ServiceIrrigationService,
    private auth: AuthService,
    private modifyService: ModifyCityMunService
  ) {}

  modifyCityMun(cityMunName: string) {
    return this.modifyService.ModifyText(cityMunName);
  }

  message = 'Irrigation Systems';

  viewData: boolean = true;
  parentMethod() {
    // alert('parent Method');
    this.viewData = true;
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
  irrigation: any = {};
  vieIrrig: any = {};

  Init() {
    this.GetIrrigation();
  }

  GetIrrigation() {
    console.log(this.munCityId + ' | ' + this.setYear);

    this.service.GetServiceIrrigation(this.munCityId, this.setYear).subscribe({
      next: (response) => {
        console.log(response);
        if (response !== null) {
          this.irrigation = <any>response;
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

  AddIrrigation() {
    if (!isEmptyObject(this.irrigation)) {
      this.irrigation.setYear = this.setYear;
      this.irrigation.munCityId = this.munCityId;
      this.service.AddServiceIrrigation(this.irrigation).subscribe({
        next: (request) => {
          this.GetIrrigation();
        },
        error: (error) => {
          Swal.fire('Oops!', 'Something went wrong.', 'error');
        },
        complete: () => {
          // if (!this.isCheck) {
          this.closebutton.nativeElement.click();
          // }
          this.irrigation = {};
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

  EditIrrigation() {
    this.irrigation.setYear = this.setYear;
    this.irrigation.munCityId = this.munCityId;

    this.service.EditServiceIrrigation(this.irrigation).subscribe({
      next: (request) => {
        this.GetIrrigation();
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

  DeleteIrrigation(transId: any) {
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
        this.service.DeleteServiceIrrigation(transId).subscribe((request) => {
          this.Init();
          this.irrigation = {};
        });
        Swal.fire('Deleted!', 'Your file has been deleted.', 'success');
      }
    });
  }
}
