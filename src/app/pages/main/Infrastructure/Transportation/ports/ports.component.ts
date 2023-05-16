import { Component, OnInit, ViewChild} from '@angular/core';
import Swal from 'sweetalert2';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { PortsService } from 'src/app/shared/Infrastructure/Transportation/ports.service';
@Component({
  selector: 'app-ports',
  templateUrl: './ports.component.html',
  styleUrls: ['./ports.component.css']
})
export class PortsComponent implements OnInit {
  constructor(private service: PortsService, private auth: AuthService) { }

  munCityName:string = this.auth.munCityName;

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
  listData:any = [];
  data:any = {};
  listBarangay:any = [];

  listofOwnership:any = [{id: `1`, type: `Government`}, {id: `2`, type: `Private`}];
  listofPort:any = [{id: `1`, type: `Airport`}, {id: `2`, type: `Seaport`}, {id: `3`, type: `Inland Riverport`}];

  Init()
  {
    this.GetListBarangay();
    this.GetListData();
  }

  GetListBarangay() 
  {
    this.service.ListOfBarangay(this.auth.munCityId).subscribe(data => {
      this.listBarangay = (<any>data);
      console.log(this.listBarangay);
    })
  }

  GetListData()
  {
    this.service.GetListPort(this.setYear, this.munCityId).subscribe({
      next: (response) =>
      {
        this.listData = (<any> response);
        console.log(this.listData);
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

  AddData()
  {
    this.toValidate.brgyId = this.data.brgyId=="" || this.data.brgyId ==null?true:false; 
    this.toValidate.name = this.data.name=="" || this.data.name ==null?true:false; 
    
    this.data.setYear   = this.setYear;
    this.data.munCityId = this.munCityId;
   
    if(!this.toValidate.station && !this.toValidate.brgyId)
    {
      this.service.AddPort(this.data).subscribe(
        {
          next: (request) => {
            this.GetListData();
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

  EditData()
  {

    this.data.longtitude = this.gmapComponent.markers.lng;
    this.data.latitude  = this.gmapComponent.markers.lat;

    this.data.setYear   = this.setYear;
    this.data.munCityId = this.munCityId;

    this.service.EditPort(this.data).subscribe(
      {
        next: (request) => {
          this.closebutton.nativeElement.click();
          this.GetListData();
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
           Swal.fire(
            'Good job!',
            'Data Updated Successfully!',
            'success'
            );
        }
      }
    )
  }

  DeleteData(transId:any)
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
        this.service.DeletePort(transId).subscribe(request => {
          this.GetListData();
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
