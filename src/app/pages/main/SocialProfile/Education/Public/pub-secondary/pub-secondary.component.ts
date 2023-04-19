import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { EducationService } from 'src/app/shared/SocialProfile/Education/education.service';

@Component({
  selector: 'app-pub-secondary',
  templateUrl: './pub-secondary.component.html',
  styleUrls: ['./pub-secondary.component.css']
})
export class PubSecondaryComponent implements OnInit {
  menuId:string = "5";
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
  listElems:any = [];
  secondary:any = {};
  listBarangay:any = [];

  Init()
  {
    this.GetListBarangay();
    this.GetListPublicSecSchool();
  }

  GetListBarangay() 
  {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe(data => {
      this.listBarangay = (<any>data);
    })
  }

  GetListPublicSecSchool()
  {
    this.service.GetListEducation(this.menuId, this.setYear, this.munCityId).subscribe({
      next: (response) =>
      {
        this.listElems = (<any> response);
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

  AddPublicSecSchool()
  {
    this.toValidate.name = this.secondary.name=="" || this.secondary.name ==null?true:false;
    this.toValidate.brgyId = this.secondary.brgyId=="" || this.secondary.brgyId ==null?true:false; 
    
    this.secondary.menuId    = this.menuId;
    this.secondary.setYear   = this.setYear;
    this.secondary.munCityId = this.munCityId;
   
    if(!this.toValidate.name && !this.toValidate.brgyId)
    {
      this.service.AddEducation(this.secondary).subscribe(
        {
          next: (request) => {
            this.GetListPublicSecSchool();
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
            this.secondary = {};
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

  EditPublicSecSchool()
  {

    this.secondary.longtitude = this.gmapComponent.markers.lng;
    this.secondary.latitude  = this.gmapComponent.markers.lat;

    this.secondary.menuId    = this.menuId;
    this.secondary.setYear   = this.setYear;
    this.secondary.munCityId = this.munCityId;

    this.service.EditEducation(this.secondary).subscribe(
      {
        next: (request) => {
          this.GetListPublicSecSchool();
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

  DeletePublicSecSchool(transId:any)
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
          this.GetListPublicSecSchool();
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
