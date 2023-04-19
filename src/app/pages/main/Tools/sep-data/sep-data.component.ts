import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SepDataService } from 'src/app/shared/Tools/sep-data.service';

@Component({
  selector: 'app-sep-data',
  templateUrl: './sep-data.component.html',
  styleUrls: ['./sep-data.component.css']
})
export class SepDataComponent implements OnInit {

  list_muncity:any = {};
  set_year:any;
  muncity_id:any;
  muncity:any =  {};

  constructor(private service:SepDataService,private auth:AuthService) { }

  ngOnInit(): void {
    //console.log("SEPDATA");
    this.set_year = this.auth.setYear;
    this.muncity_id = this.auth.munCityId;
    this.Init();
    
  }

  Init(){
    this.service.ListMunCity().subscribe(data=>{
      this.list_muncity =(<any>data);         
      console.log(this.list_muncity)
     })
  }
  onChange(value: any) {
    console.log(value.target.value)
  }
  SetData(){
    this.list_muncity;
    var newArray = this.list_muncity.filter( (el:any) =>
    {
      return el.munCityId == this.muncity_id ;
    }
    );
    //console.log("newArray: ", newArray[0].munCityName)

    //console.log("a: ", this.auth.munCityId)
   // console.log("set_year: ", this.set_year)
   // console.log("muncity: ", this.muncity.munCityId + " " + this.muncity.munCityName )
    localStorage.setItem("setYear", this.set_year);
    localStorage.setItem("munCityId", this.muncity_id);
    localStorage.setItem("munCityName", newArray[0].munCityName);
    window.location.reload()


  }
}
