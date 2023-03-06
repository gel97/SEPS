import { CityOfficialService } from '../../../../shared/Governance/city-official.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { GeoProfileService } from 'src/app/shared/Governance/geo-profile.service';

@Component({
  selector: 'app-geo-profile',
  templateUrl: './geo-profile.component.html',
  styleUrls: ['./geo-profile.component.css']
})
export class GeoProfileComponent implements OnInit {

constructor( private service:GeoProfileService, private auth:AuthService) { }
ViewGeo: any =[];
geo:any={};
updategeo:any ={};
inputDisabled:boolean=false;
editgeo:any ={};


  date = new DatePipe('en-PH')
  ngOnInit(): void {
  this.Init(
  );
}

Init(){
  this.geo.munCityId=this.auth.munCityId;
  this.geo.activeSetYear=this.auth.activeSetYear;

  this.service.GetGeo().subscribe(data=>{
  this.ViewGeo=(<any>data);
  //textfield(enable/disabled)
  this.inputDisabled = this.ViewGeo !=null?true:false;

  if(this.ViewGeo !== null)
  {
    this.geo = this.ViewGeo;
  }
  console.log(this.ViewGeo)
 })
}

  AddGeo() {
    this.geo.munCityId=this.auth.munCityId;
    this.geo.activeSetYear=this.auth.activeSetYear;
    this.service.AddGeoP(this.geo).subscribe(_data=>{
      Swal.fire(
        'Good job!',
        'Data Added Successfully!',
        'success'
      );
      this.Init();
      this.geo = {};

    },err=>{
      Swal.fire(
        'ERROR!',
        'Error',
        'error'
      );
      this.Init();
      this.geo = {};
    });
  }

  editgeoprof(editgeoprof:any={}) {
    this.editgeo=editgeoprof;
  //passing the data from table (modal)
  this.Init();
  }

  //for modal
  update(){
  this.service.UpdateGeo(this.editgeo).subscribe({next:(_data)=>{
  // this.editModal();
  },
  });

  Swal.fire({
  position: 'center',
  icon: 'success',
  title: 'Your work has been updated',
  showConfirmButton: false,
  timer: 1000
  });
  this.editgeo ={};

  }



}
