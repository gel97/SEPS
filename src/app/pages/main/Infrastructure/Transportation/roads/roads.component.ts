import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TrasportationService } from 'src/app/shared/Trasportation/trasportation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-roads',
  templateUrl: './roads.component.html',
  styleUrls: ['./roads.component.css']
})
export class RoadsComponent implements OnInit {

  constructor(private service:TrasportationService, private auth: AuthService) { }

  TranspoRoadList:any=[];
  RoadList: any={};
  isNew : boolean=true;
  
RoadType:any=[
  {id:'rt01',roadtypename:'National Roads'},
  {id:'rt02',roadtypename:'Provincial Roads'},
  {id:'rt03',roadtypename:'Municipal/City Roads'},
  {id:'rt04',roadtypename:'Barangay Roads'},
  {id:'rt05',roadtypename:'NIA Roads'},
  {id:'rt06',roadtypename:'Expressways/Toll Roads'},
  {id:'rt07',roadtypename:'Private Industrial Roads'},
  {id:'rt08',roadtypename:'Private Subdivision Roads'},
  {id:'rt09',roadtypename:'Other/Unspecified'},
];



  ngOnInit(): void {
    this.getListTranspoRoad();
  }

  getListTranspoRoad(){
    this.service.get_list_transpo_road().subscribe(data=>{
      this.TranspoRoadList = (<any>data);
      
      for (let i of this.TranspoRoadList) {
        for (let r of this.RoadType) {
         if (i.roadType == r.id){
          i.roadtypename = r.roadtypename;
          break;
         }
        }
        }


    })
  }

  saveRoadList(){
    this.RoadList.setYear = this.auth.activeSetYear;
    this.RoadList.munCityId = this.auth.munCityId;
    this.RoadList.tag=1;
    this.RoadList.totalLength = String(Number(this.RoadList.concrete)+Number(this.RoadList.asphalt)+Number(this.RoadList.gravel)+Number(this.RoadList.earth));
  
    this.service.post_save_transpo_road(this.RoadList).subscribe(data=>{
      Swal.fire(
        'Saved!',
        'Data successfully saved.',
        'success'
      )

      for (let r of this.RoadType) {
        if ((<any>data).roadType == r.id){
          (<any>data).roadtypename = r.roadtypename;
          break;

        }
         
       }

      this.TranspoRoadList.push(<any>data);
      
    },error=>{
      alert ("ERROR")
    })

  
  }

  updateRoadList(){

    this.RoadList.totalLength = String(Number(this.RoadList.concrete)+Number(this.RoadList.asphalt)+Number(this.RoadList.gravel)+Number(this.RoadList.earth));
    this.service.put_update_transpo_road(this.RoadList).subscribe(data=>{
      Swal.fire(
        'Updated!',
        'Data successfully updated.',
        'success'
      )
      
    },err=>{
      alert ("ERROR")
    })
  }

  deleteRoadList(transId:any="", index:any=""){
    this.service.delete_transpo_road(transId).subscribe(data=>{
      Swal.fire(
        'Deleted!',
        'Data successfully deleted.',
        'success'
      )
      this.TranspoRoadList.splice(index,1)
      
    },err=>{
      alert ("ERROR")
    })

  }
}
