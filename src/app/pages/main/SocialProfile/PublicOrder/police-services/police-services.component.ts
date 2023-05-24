import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SafetyServicesService } from 'src/app/shared/SocialProfile/PublicOrder/safety-services.service';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { isEmptyObject } from 'jquery';

@Component({
  selector: 'app-police-services',
  templateUrl: './police-services.component.html',
  styleUrls: ['./police-services.component.css']
})
export class PoliceServicesComponent implements OnInit {
  munCityName:string = this.auth.munCityName;
  constructor(private service: SafetyServicesService, private auth: AuthService) { }
  toValidate:any = {};
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };
  isCheck: boolean = false;

  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }


  ngOnInit(): void {
    this.Init();
  }
  munCityId:string = this.auth.munCityId;
  setYear:string = this.auth.setYear;
  menuId = "1";
  data:any = {};

  isAdd:boolean = true;
  hasData:boolean = false;
  irrigation:any = {};
  vieIrrig:any={};

  Init()
  {
    this.GetSafetyServices();
  }

  GetSafetyServices()
  {
    console.log(this.munCityId+ " | "+this.setYear)

    this.service.GetSafetyServices(this.menuId, this.setYear,this.munCityId).subscribe({
      next: (response) => {
        console.log(response)
        if(response.length >0)
        {
          this.data =  (<any> response[0]);
          console.log("data: ", this.data)

          this.hasData = true;
        }
        else{
          this.hasData = false;
        }

      },
      error: (error) =>
      {
        Swal.fire(
          'Oops!',
          'Something went wrong.',
          'error'
          );
      },
      complete: () =>
      {

      }
    })

  }


  AddSafetyServices()
  {


    if(!isEmptyObject(this.data))
    {
      this.data.setYear   = this.setYear;
      this.data.munCityId = this.munCityId;
      this.data.menuId = this.menuId;
      this.service.AddSafetyServices(this.data).subscribe({

          next: (request) => {
            this.GetSafetyServices();
          },
          error:(error)=>{
            Swal.fire(
              'Oops!',
              'Something went wrong.',
              'error'
              );
          },
          complete: () =>
          {
            if (!this.isCheck) {
              this.closebutton.nativeElement.click();
            }
            this.data = {};
             Swal.fire(
              'Good job!',
              'Data Added Successfully!',
              'success'
              );
          }
        }
      )
    }
    else
    {
      Swal.fire(
        'Missing Data!',
        'Please fill out the required fields.',
        'warning'
        );
    }


  }

  EditSafetyServices()
  {

    this.data.setYear   = this.setYear;
    this.data.munCityId = this.munCityId;
    this.data.menuId = this.menuId;
    this.service.EditSafetyServices(this.data).subscribe(
      {
        next: (request) => {
          this.GetSafetyServices();
        },
        error:(error)=>{
          Swal.fire(
            'Oops!',
            'Something went wrong.',
            'error'
            );
        },
        complete: () =>
        {
          this.closebutton.nativeElement.click();
           Swal.fire(
            'Good job!',
            'Data Updated Successfully!',
            'success'
            );
        }
      }
    )
  }

  DeleteSafetyServices(transId:any)
  {
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
        this.service.DeleteSafetyServices(transId).subscribe(request => {
          this.Init();
          this.data = {};
        })
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }
}

