import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { MouseEvent } from '@agm/core';
import {AgmMap, AgmMarker, AgmInfoWindow  } from '@agm/core';
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

  @ViewChild('search')
  public searchElementRef: ElementRef | any;
  address: string = "";
  geoCoder:any;
  searchLoc:string = ""

  constructor(private mapsAPILoader: MapsAPILoader,private ngZone: NgZone
    ) { }

    ngOnInit() {

      this.init();
      //load Places Autocomplete
     
    }

    changeFn(e:any) {
      this.searchLoc = e;
      console.log(this.searchLoc)
      this.init();

    }

  
  init()
  {
    console.log("search");
    this.mapsAPILoader.load().then(() => {
      //this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          //set latitude, longitude and zoom
          this.lat = place.geometry.location!.lat();
          this.lng = place.geometry.location!.lng();
          this.zoom = 12;
        });
      });
    });
  }
   
     // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.lat, this.lng);
      });
    }
  } 

  getAddress(latitude:any, longitude:any) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results:any, status:any) => {
      console.log(results);
      console.log(status);
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  ngAfterViewInit(): void {
    // Trigger markerClick event to open info window by default
    this.init();

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
