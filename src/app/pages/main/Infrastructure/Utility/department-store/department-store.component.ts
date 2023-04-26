import { Component, OnInit, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { ServiceFacilitiesService } from 'src/app/shared/Infrastructure/Utilities/service-facilities.service';

@Component({
  selector: 'app-department-store',
  templateUrl: './department-store.component.html',
  styleUrls: ['./department-store.component.css']
})
export class DepartmentStoreComponent implements OnInit {

  menuId:string = "9";
  munCityName:string = this.auth.munCityName;
  constructor(private service: ServiceFacilitiesService, private auth: AuthService) { }

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
  listFacilities:any = [];
  facility:any = {};
  listBarangay:any = [];

  Init()
  {
    this.GetListBarangay();
    this.GetListFacilities();
  }

  GetListBarangay() 
  {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe(data => {
      this.listBarangay = (<any>data);
    })
  }

  GetListFacilities()
  {
    this.service.GetListServiceFacilities(this.menuId, this.setYear, this.munCityId).subscribe({
      next: (response) =>
      {
        this.listFacilities = (<any> response);
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

  AddFacility()
  {
    this.toValidate.name = this.facility.name=="" || this.facility.name ==null?true:false;
    this.toValidate.brgyId = this.facility.brgyId=="" || this.facility.brgyId ==null?true:false; 
    
    this.facility.menuId    = this.menuId;
    this.facility.setYear   = this.setYear;
    this.facility.munCityId = this.munCityId;
   
    if(!this.toValidate.name && !this.toValidate.brgyId)
    {
      this.service.AddServiceFacility(this.facility).subscribe(
        {
          next: (request) => {
            this.GetListFacilities();
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
            this.facility = {};
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

  EditFacility()
  {

    this.facility.longtitude = this.gmapComponent.markers.lng;
    this.facility.latitude  = this.gmapComponent.markers.lat;

    this.facility.menuId    = this.menuId;
    this.facility.setYear   = this.setYear;
    this.facility.munCityId = this.munCityId;

    this.service.EditServiceFacility(this.facility).subscribe(
      {
        next: (request) => {
          this.GetListFacilities();
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

  DeleteFacility(transId:any)
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
        this.service.DeleteServiceFacility(transId).subscribe(request => {
          this.GetListFacilities();
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
