import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { CellSitesService } from 'src/app/shared/Infrastructure/Utilities/Communication/cell-sites.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cell-sites',
  templateUrl: './cell-sites.component.html',
  styleUrls: ['./cell-sites.component.css']
})
export class CellSitesComponent implements OnInit {

  munCityName:string = this.auth.munCityName;
  constructor(private service:CellSitesService, private auth: AuthService) { }

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

  Add_cell:boolean = true;
  CellSites:any = [];
  cell:any = {};
  barangays:any = [];

  Init()
  {
    this.GetListBarangay();
    this.GetList_CellSites();
  }

  GetListBarangay()
  {
    this.service.ListBarangay().subscribe(data => {
      this.barangays = (<any>data);
    })
  }

  GetList_CellSites()
  {
    this.service.List_CellSites(this.setYear, this.munCityId).subscribe({
      next: (response) =>
      {
        this.CellSites = (<any> response);
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

  Add_CellSites()
  {
    this.toValidate.telcom = this.cell.telcom=="" || this.cell.telcom ==undefined?true:false;
    this.toValidate.tower = this.cell.tower=="" || this.cell.tower ==undefined?true:false;
    this.toValidate.brgyId = this.cell.brgyId=="" || this.cell.brgyId ==null?true:false;

    this.cell.setYear   = this.setYear;
    this.cell.munCityId = this.munCityId;

    if(!this.toValidate.telcom && !this.toValidate.brgyId  && !this.toValidate.tower)
    {
      this.service.Add_CellSites(this.cell).subscribe(
        {

          next: (request) => {
            this.GetList_CellSites();
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
              'Data Added Successfully!',
              'success'
              );
              this.GetList_CellSites();
              this.cell = {};
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

  Update_CellSites()
  {
    this.toValidate.telcom = this.cell.telcom=="" || this.cell.telcom ==undefined?true:false;
    this.toValidate.tower = this.cell.tower=="" || this.cell.tower ==undefined?true:false;
    this.toValidate.brgyId = this.cell.brgyId=="" || this.cell.brgyId ==null?true:false;

    this.cell.longtitude = this.gmapComponent.markers.lng;
    this.cell.latitude  = this.gmapComponent.markers.lat;

    this.cell.setYear   = this.setYear;
    this.cell.munCityId = this.munCityId;

    if(!this.toValidate.telcom && !this.toValidate.brgyId  && !this.toValidate.tower)
    {
    this.service.Update_CellSites(this.cell).subscribe(
      {
        next: (request) => {
          this.GetList_CellSites();
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
  else
  {

    Swal.fire(
      '',
      'Please fill out the required fields.',
      'warning'
      );
  }

  }

  Delete_CellSites(transId:any)
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
        this.service.Delete_CellSites(transId).subscribe(request => {
          this.GetList_CellSites();
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
