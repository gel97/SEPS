import { Component, OnInit, ViewChild, NgZone  } from '@angular/core';
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
  barangayData: any;

  constructor(private changeDetectorRef: ChangeDetectorRef, private zone: NgZone) {}

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
  polygonCoords: any[] = [];
  selectedBarangayBoundary: any[] = [];

  lat: number = 7.454187360536494;
  lng: number = 125.80778447882858;
   mapReady = false;
  onMapTypeChange() {
    console.log(this.mapType);
    this.changeDetectorRef.detectChanges();
  }
  onMapReady(map: google.maps.Map) {
    // Force redraw when the modal becomes visible
    setTimeout(() => {
      google.maps.event.trigger(map, 'resize');
      map.setCenter({ lat: this.lat, lng: this.lng });
    }, 500);

    const drawingManager = new google.maps.drawing.DrawingManager({
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
      drawingControl: true,
      drawingControlOptions: {
        position: google.maps.ControlPosition.TOP_CENTER,
        drawingModes: ['polygon']
      },
      polygonOptions: {
        editable: true,
        fillColor: '#007bff',
        fillOpacity: 0.2,
        strokeColor: '#007bff',
        strokeWeight: 2
      }
    });

    drawingManager.setMap(map);

    google.maps.event.addListener(drawingManager, 'polygoncomplete', (polygon: any) => {
      this.zone.run(() => {
        this.selectedBarangayBoundary = polygon.getPath().getArray().map((point: any) => ({
          lat: point.lat(),
          lng: point.lng()
        }));
        console.log('Polygon drawn:', this.selectedBarangayBoundary);
      });
    });
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
  ngOnChanges() {
  if (this.barangayData) {
    this.lat = this.barangayData.latitude;
    this.lng = this.barangayData.longitude;
    this.markers = {
      lat: this.lat,
      lng: this.lng,
      label: this.barangayData.brgyName?.charAt(0),
      draggable: true,
    };

    this.brgyName = this.barangayData.brgyName;

    // ✅ Auto-generate a polygon if none is provided
    if (this.barangayData.coordinates && this.barangayData.coordinates.length > 0) {
      this.selectedBarangayBoundary = this.barangayData.coordinates;
    } else {
      // generate a simple square polygon around the center point
      const offset = 0.002; // roughly ~200m depending on zoom level
      this.selectedBarangayBoundary = [
        { lat: this.lat + offset, lng: this.lng - offset },
        { lat: this.lat + offset, lng: this.lng + offset },
        { lat: this.lat - offset, lng: this.lng + offset },
        { lat: this.lat - offset, lng: this.lng - offset },
        { lat: this.lat + offset, lng: this.lng - offset },
      ];
      console.log('Auto-generated polygon for:', this.brgyName);
    }
  }
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

  // ✅ Auto-generate polygon if not provided
  if (markerObj.coordinates && markerObj.coordinates.length > 0) {
    this.selectedBarangayBoundary = markerObj.coordinates;
    console.log('Polygon loaded:', this.selectedBarangayBoundary);
  } else {
    // 🔹 Generate a simple polygon (e.g. small square) around barangay center
    const offset = 0.002; // ~200m area
    this.selectedBarangayBoundary = [
      { lat: this.lat + offset, lng: this.lng - offset },
      { lat: this.lat + offset, lng: this.lng + offset },
      { lat: this.lat - offset, lng: this.lng + offset },
      { lat: this.lat - offset, lng: this.lng - offset },
      { lat: this.lat + offset, lng: this.lng - offset },
    ];
    console.log(`Auto-generated polygon for ${markerObj.brgyName}:`, this.selectedBarangayBoundary);
  }

  // ✅ Set barangay name
  if (markerObj.brgyName) {
    this.brgyName = markerObj.brgyName;
    this.munCityName = markerObj.munCityName || '';
  } else {
    this.getAddress(markerObj.lat, markerObj.lng);
  }
}




  clearMarker() {
  this.markers = null;     // remove marker object
  this.isEmptyGeo = true;  // ensure UI knows wala'y geo
  this.selectedBarangayBoundary = []; // remove polygon if needed
}


}
