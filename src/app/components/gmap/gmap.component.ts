import { Component, OnInit, ViewChild } from '@angular/core';
import { MouseEvent } from '@agm/core';
import { AgmMap, AgmMarker, AgmInfoWindow } from '@agm/core';
import { MapsAPILoader } from '@agm/core';
import { ChangeDetectorRef } from '@angular/core';


declare var google: any;

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css'],
})
export class GmapComponent {
  @ViewChild(AgmMap) map: AgmMap | any;
  @ViewChild(AgmMarker) marker: AgmMarker | any;
  @ViewChild(AgmInfoWindow) infoWindow: AgmInfoWindow | any;

  geocoder = new google.maps.Geocoder();

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    
    this.marker.triggerMarkerClick();

    
    this.infoWindow.isOpen = true;
  }
  searchQuery: string = '';
  markers: any = {};
  brgyName: string = '';
  munCityName: string = '';
  isEmptyGeo: boolean = true;
  mapType: string = 'roadmap'; 
  zoom: number = 10;

  lat: number = 7.454187360536494;
  lng: number = 125.80778447882858;

  onMapTypeChange() {
    console.log(this.mapType);
    this.changeDetectorRef.detectChanges();
  }
  
  clickedMarker(label: string, index: number) {
    console.log(`clicked the marker: ${label || index}`);
  }

  mapClicked($event: MouseEvent) {
    this.markers = {
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true,
    };
    this.isEmptyGeo = false;

    this.getAddress(this.markers.lat, this.markers.lng);
  }

  markerDragEnd(m: any, $event: MouseEvent) {
    this.markers.lat = $event.coords.lat;
    this.markers.lng = $event.coords.lng;
    this.getAddress(this.markers.lat, this.markers.lng);
  }
  getAddress(lat: number, lng: number) {
  const latlng = { lat: lat, lng: lng };
  this.geocoder.geocode({ location: latlng }, (results: any, status: any) => {
    if (status === 'OK' && results[0]) {
      let address = results[0].formatted_address;

      // Extract barangay/municipality if possible
      let brgy = '';
      let city = '';
      let province = '';

      results[0].address_components.forEach((component: any) => {
        if (component.types.includes('sublocality') || component.types.includes('sublocality_level_1')) {
          brgy = component.long_name;
        }
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_2')) {
          province = component.long_name;
        }
      });

      // Prefer detailed barangay/city/province if available
      if (brgy || city || province) {
        this.brgyName = [brgy, city, province].filter(Boolean).join(', ');
      } else {
        this.brgyName = address; // fallback to full address
      }

      console.log('Resolved Address:', this.brgyName);
    } else {
      console.error('Geocoder failed due to: ' + status);
      this.brgyName = 'Unknown Location';
    }
  });
}





  setMarker(markerObj: any) {
  if (markerObj.lat == null && markerObj.lng == null) {
    this.isEmptyGeo = true;
    return;
  }

  this.isEmptyGeo = false;
  this.lat = markerObj.lat;
  this.lng = markerObj.lng;
  this.markers = markerObj;

  // If DB has no brgyName, resolve it dynamically
  if (markerObj.brgyName) {
    this.brgyName = markerObj.brgyName;
    this.munCityName = markerObj.munCityName || '';
  } else {
    this.getAddress(markerObj.lat, markerObj.lng);
  }
}





  clearMarker() {
    this.markers = [];
  }
}
