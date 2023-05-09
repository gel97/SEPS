import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EducationService } from 'src/app/shared/SocialProfile/Education/education.service';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';

@Component({
  selector: 'app-day-care',
  templateUrl: './day-care.component.html',
  styleUrls: ['./day-care.component.css']
})
export class DayCareComponent implements OnInit {
  menuId:string = "3";
  munCityName:string = this.auth.munCityName;
  constructor(private service: EducationService, private auth: AuthService) { }

  toValidate:any = {};
  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;
  @ViewChild('closebutton')
  closebutton!: { nativeElement: { click: () => void; }; };
  isCheck: boolean = false;
  onChange(isCheck: boolean) {
    this.isCheck = isCheck;
    console.log("isCheck:", this.isCheck);
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log(data);
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
  listDaycare:any = [];
  daycare:any = {};
  listBarangay:any = [];

  Init()
  {
    this.GetListBarangay();
    this.GetListDcarechool();
  }

  GetListBarangay() 
  {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe(data => {
      this.listBarangay = (<any>data);
    })
  }

  GetListDcarechool()
  {
    this.service.GetListEducation(this.menuId, this.setYear, this.munCityId).subscribe({
      next: (response) =>
      {
        this.listDaycare = (<any> response);
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

  AddDcareSchool()
  {
    this.toValidate.name = this.daycare.name=="" || this.daycare.name ==null?true:false;
    this.toValidate.brgyId = this.daycare.brgyId=="" || this.daycare.brgyId ==null?true:false; 
    
    this.daycare.menuId    = this.menuId;
    this.daycare.setYear   = this.setYear;
    this.daycare.munCityId = this.munCityId;
   
    if(!this.toValidate.name && !this.toValidate.brgyId)
    {
      this.service.AddEducation(this.daycare).subscribe(
        {
          next: (request) => {
            this.GetListDcarechool();
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
            this.daycare = {};
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

  EditDcareSchool()
  {

    this.daycare.longtitude = this.gmapComponent.markers.lng;
    this.daycare.latitude  = this.gmapComponent.markers.lat;

    this.daycare.menuId    = this.menuId;
    this.daycare.setYear   = this.setYear;
    this.daycare.munCityId = this.munCityId;

    this.service.EditEducation(this.daycare).subscribe(
      {
        next: (request) => {
          this.GetListDcarechool();
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

  DeleteDcareSchool(transId:any)
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
        this.service.DeleteEducation(transId).subscribe(request => {
          this.GetListDcarechool();
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

