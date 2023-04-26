import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { EducationOsyService } from 'src/app/shared/SocialProfile/Education/educationOsy.service';

@Component({
  selector: 'app-oschool-youth',
  templateUrl: './oschool-youth.component.html',
  styleUrls: ['./oschool-youth.component.css']
})
export class OSchoolYouthComponent implements OnInit {
  munCityName:string = this.auth.munCityName;
  constructor(private service: EducationOsyService, private auth: AuthService) { }

  toValidate:any = {};
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };
  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
    this.markerObj = {
      lat: data.latitude,
      lng: data.longtitude,
      label: data.brgyName.charAt(0),
      brgyName: data.brgyName,
      munCityName: this.munCityName,
      draggable: true
    };

    this.gmapComponent.setMarker(this.markerObj);
  }

  ngOnInit(): void {
    this.Init();
  }
  munCityId:string = this.auth.munCityId;
  setYear:string = this.auth.setYear;

  isAdd:boolean = true;
  listOsy:any = [];
  osy:any = {};
  listBarangay:any = [];

  Init()
  {
    this.GetListBarangay();
    this.GetListOsy();
  }

  GetListBarangay() 
  {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe(data => {
      this.listBarangay = (<any>data);
    })
  }

  GetListOsy()
  {
    this.service.GetListEducationOsy(this.munCityId, this.setYear).subscribe({
      next: (response) =>
      {
        this.listOsy = (<any> response);
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

  AddOsy()
  {
    this.toValidate.brgyId = this.osy.brgyId=="" || this.osy.brgyId ==null?true:false; 
    
    this.osy.setYear   = this.setYear;
    this.osy.munCityId = this.munCityId;
   
    if(!this.toValidate.name && !this.toValidate.brgyId)
    {
      this.service.AddEducationOsy(this.osy).subscribe(
        {
          next: (request) => {
            this.GetListOsy();
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
            this.osy = {};
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

  EditOsy()
  {

    this.osy.longtitude = this.gmapComponent.markers.lng;
    this.osy.latitude  = this.gmapComponent.markers.lat;

    this.osy.setYear   = this.setYear;
    this.osy.munCityId = this.munCityId;

    this.service.EditEducationOsy(this.osy).subscribe(
      {
        next: (request) => {
          this.GetListOsy();
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

  DeleteOsy(transId:any)
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
        this.service.DeleteEducationOsy(transId).subscribe(request => {
          this.GetListOsy();
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
