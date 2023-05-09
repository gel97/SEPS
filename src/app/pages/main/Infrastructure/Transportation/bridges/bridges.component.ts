import { Component, OnInit, ViewChild } from '@angular/core';
import { GmapComponent } from 'src/app/components/gmap/gmap.component';
import { AuthService } from 'src/app/services/auth.service';
import { TrasportationService } from 'src/app/shared/Trasportation/trasportation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-bridges',
  templateUrl: './bridges.component.html',
  styleUrls: ['./bridges.component.css']
})
export class BridgesComponent implements OnInit {

  @ViewChild(GmapComponent)
  private gmapComponent!: GmapComponent;

  constructor(private service:TrasportationService, private auth: AuthService) { }
  munCityName:string = this.auth.munCityName;

  TranspoBridgeList:any=[];
  BridgeList: any={};
  BarangayList: any=[];
  isNew : boolean=true;
  

  ngOnInit(): void {
    
    this.getListTranspoBridge();
  }

  markerObj: any = {};

  SetMarker(data: any = {}) {
    console.log("lnglat: ", data.longtitude+ " , " + data.latitude)
  
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
  


  getListTranspoBridge(){

    this.service.get_list_barangay().subscribe(data=>{
      this.BarangayList = (<any>data);
    })

    this.service.get_list_transpo_bridge().subscribe(data=>{
      this.TranspoBridgeList = (<any>data);
    })
  }

  saveBridgeList(){
    this.BridgeList.setYear = this.auth.activeSetYear;
    this.BridgeList.tag=1;
  
    this.service.post_save_transpo_bridge(this.BridgeList).subscribe(data=>{
      Swal.fire(
        'Saved!',
        'Data successfully saved.',
        'success'
      )
      this.TranspoBridgeList.push(<any>data);
      
    },error=>{
      alert ("ERROR")
    })

  
  }

  updateBridgeList(){

    this.BridgeList.longtitude = this.gmapComponent.markers.lng;
    this.BridgeList.latitude = this.gmapComponent.markers.lat;
    this.service.put_update_transpo_bridge(this.BridgeList).subscribe(data=>{
      Swal.fire(
        'Updated!',
        'Data successfully updated.',
        'success'
      )
      
    },err=>{
      alert ("ERROR")
    })
  }

  deleteBridgeList(transId:any="", index:any=""){
    this.service.delete_transpo_bridge(transId).subscribe(data=>{
      Swal.fire(
        'Deleted!',
        'Data successfully deleted.',
        'success'
      )
      this.TranspoBridgeList.splice(index,1)
      
    },err=>{
      alert ("ERROR")
    })

  }

}
