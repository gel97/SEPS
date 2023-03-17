import { Component, OnInit, ViewChild } from '@angular/core';
import { MapInfoWindow, MapMarker } from '@angular/google-maps';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  constructor() {}
  ngOnInit(): void {}
  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow | undefined;
  center: google.maps.LatLngLiteral = {
      lat: 24,
      lng: 12
  };
  display: any;

  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 4;
  addMarker(event: google.maps.MapMouseEvent) {
      if (event.latLng != null) this.markerPositions.push(event.latLng.toJSON());
  }
  openInfoWindow(marker: MapMarker) {
      if (this.infoWindow != undefined) this.infoWindow.open(marker);
  }
  move(event: any) {
    if (event.latLng != null) this.display = event.latLng.toJSON();
}
}
