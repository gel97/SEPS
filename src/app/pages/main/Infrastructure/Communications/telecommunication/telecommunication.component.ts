import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { TelecommunicationService } from 'src/app/shared/Infrastructure/Utilities/Communication/telecommunication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-telecommunication',
  templateUrl: './telecommunication.component.html',
  styleUrls: ['./telecommunication.component.css']
})
export class TelecommunicationComponent implements OnInit {


  munCityName:string = this.auth.munCityName;
  not_visible: boolean =false;
  visible: boolean =true;
  constructor(private service:TelecommunicationService, private auth: AuthService) { }

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
  clearData() {
    this.telco = {};
    this.not_visible = false;
    this.visible = true;
    // this.required = false;
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

  list_of_type = [
    { id: 1, name: "Globe" },
    { id: 2, name: "Smart" },
  ];

  ngOnInit(): void {
    this.Init();
  }
  munCityId:string = this.auth.munCityId;
  setYear:string = this.auth.setYear;

  Add_tel:boolean = true;
  Telco:any = [];
  telco:any = {};
  barangays:any = [];

  Init()
  {
    this.GetListBarangay();
    this.GetList_Telco();
  }

  GetListBarangay()
  {
    this.service.ListBarangay().subscribe(data => {
      this.barangays = (<any>data);
    })
  }

  GetList_Telco()
  {
    this.service.List_telcom(this.setYear, this.munCityId).subscribe({
      next: (response) =>
      {
        this.Telco = (<any> response);
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

  Add_Tel()
  {
    this.toValidate.telco = this.telco.telco=="" || this.telco.telco ==undefined?true:false;
    this.toValidate.type = this.telco.type=="" || this.telco.type ==null?true:false;
    this.toValidate.brgyId = this.telco.brgyId=="" || this.telco.brgyId ==null?true:false;
    this.toValidate.installed = this.telco.installed=="" || this.telco.installed ==undefined?true:false;
    this.toValidate.subscribed = this.telco.subscribed=="" || this.telco.subscribed ==undefined?true:false;

    this.telco.setYear   = this.setYear;
    this.telco.munCityId = this.munCityId;

    if(!this.toValidate.telco && !this.toValidate.brgyId  && !this.toValidate.type && !this.toValidate.installed  && !this.toValidate.subscribed)
    {
      this.service.Add_telcom (this.telco).subscribe({ next: (request) => {

            this.GetList_Telco();
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
            this.GetList_Telco();

             Swal.fire(
              'Good job!',
              'Data Added Successfully!',
              'success'
              );
              this.telco = {};
              this.GetList_Telco();
          }
        }
      )
    }
    else
    {
      Swal.fire(
        '',
        'Please fill out the required fields.',
        'warning'
        );
    }


  }

  Update_Tel()
  {
    this.toValidate.telco = this.telco.telco=="" || this.telco.telco ==undefined?true:false;
    this.toValidate.type = this.telco.type=="" || this.telco.type ==null?true:false;
    this.toValidate.brgyId = this.telco.brgyId=="" || this.telco.brgyId ==null?true:false;
    this.toValidate.installed = this.telco.installed=="" || this.telco.installed ==undefined?true:false;
    this.toValidate.subscribed = this.telco.subscribed=="" || this.telco.subscribed ==undefined?true:false;

    this.telco.longtitude = this.gmapComponent.markers.lng;
    this.telco.latitude  = this.gmapComponent.markers.lat;

    this.telco.setYear   = this.setYear;
    this.telco.munCityId = this.munCityId;

    if(!this.toValidate.telco && !this.toValidate.brgyId  && !this.toValidate.type && !this.toValidate.installed  && !this.toValidate.subscribed)
    {
    this.service.Update_telcom(this.telco).subscribe(
      {
        next: (request) => {
          this.GetList_Telco();
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
           Swal.fire(
            'Good job!',
            'Data Updated Successfully!',
            'success'
            );
        }
      }
    )
  }
  else
  {
    Swal.fire(
      '',
      'Please fill out the required fields.',
      'warning'
      );
  }
  }

  Delete_Tel(transId:any)
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
        this.service.Delete_telcom(transId).subscribe(request => {
          this.GetList_Telco();
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
