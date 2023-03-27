import { Component, OnInit, ViewChild } from '@angular/core';
import { MouseEvent } from '@agm/core';
import {AgmMap, AgmMarker, AgmInfoWindow } from '@agm/core';
import { MapsAPILoader } from '@agm/core';

declare var google: any;

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent {
  @ViewChild(AgmMap) map: AgmMap | any;
  @ViewChild(AgmMarker) marker: AgmMarker | any;
  @ViewChild(AgmInfoWindow) infoWindow: AgmInfoWindow | any;

  constructor(private mapsApiLoader: MapsAPILoader) { }


  ngAfterViewInit(): void {
    // Trigger markerClick event to open info window by default
    this.marker.triggerMarkerClick();

    // Set isOpen property to true to keep info window open
    this.infoWindow.isOpen = true;
  }
 searchQuery: string = "";
 markers: any = {}
 brgyName:string = "";
 munCityName:string = "";
 isEmptyGeo:boolean = true;

 zoom: number = 10;
  
 lat: number = 7.454187360536494;
 lng: number = 125.80778447882858;

 clickedMarker(label: string, index: number) {
   console.log(`clicked the marker: ${label || index}`)
 }
 
 mapClicked($event: MouseEvent) {
   this.markers = {
    lat: $event.coords.lat,
    lng: $event.coords.lng,
    draggable: true
   };
   this.isEmptyGeo = false;
 }
 
 markerDragEnd(m: any, $event: MouseEvent) {
  this.markers.lat = $event.coords.lat;
  this.markers.lng = $event.coords.lng;
 }
 
 setMarker (markerObj:any){
  if(markerObj.lat  == null && markerObj.lng == null)
  {
   this.isEmptyGeo = true;
  }
  else
  {
    this.isEmptyGeo = false;

  }

  this.lat = markerObj.lat;
  this.lng = markerObj.lng;
  this.brgyName = markerObj.brgyName;
  this.munCityName = markerObj.munCityName;
  this.markers = markerObj;

 }

 clearMarker (){
  this.markers = [];
 }


}
