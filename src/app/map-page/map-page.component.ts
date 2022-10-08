import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {} from 'googlemaps';

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class MapPageComponent implements OnInit {
  
  showMapPill: boolean;
  mapLoaded: boolean;
  map: google.maps.Map;
  center: google.maps.LatLngLiteral;

  time: string = '';
  distance: string = '';

  source: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;

  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
    disableDefaultUI: true,
    disableDoubleClickZoom: true,
    zoom: 12
  }

  ds: google.maps.DirectionsService;
  dr: google.maps.DirectionsRenderer;

  ngOnInit() {

    this.ds = new google.maps.DirectionsService();
    this.dr = new google.maps.DirectionsRenderer({
      map: null,
      suppressMarkers: true
    });

    navigator.geolocation.getCurrentPosition(position => {

      this.source = {
        lat: 33.9715904,
        lng: -6.8498129
      };

      this.destination = {
        lat: 33.6835086,
        lng: -7.3848547
      };

      // initialize the map container
      this.map = new google.maps.Map(document.getElementById('map-canvas'), {
        ...this.options,
        center: this.source
      });

      this.map.addListener('tilesloaded', () => {
        this.mapLoaded = true;
      });

      // adding a marker
      var markerStart = new google.maps.Marker({
        position: this.source,
        icon: {
          url: './assets/imgs/truck_pin.svg',
          anchor: new google.maps.Point(35,10),
          scaledSize: new google.maps.Size(100, 100)
        },
        map: this.map
      });

      markerStart.addListener("click", (event: any) => {
        this.showMapPill = true;
        this.onCenterMap();
      });

      var destinationMarker = new google.maps.Marker({
        position: this.destination,
        icon: {
          url: './assets/imgs/destination_custom_pin.svg',
          anchor: new google.maps.Point(35,10),
          scaledSize: new google.maps.Size(100, 100)
        },
        map: this.map
      });

      this.map.addListener("click", (event: any) => {
        this.showMapPill = false;
      });

      this.setRoutePolyline();
    });
  }

  setRoutePolyline() {
    let request = {
      origin: this.source,
      destination: this.destination,
      travelMode: google.maps.TravelMode.DRIVING
    };

    this.ds.route(request, (response, status) => {
      this.dr.setOptions({
        suppressPolylines: false,
        map: this.map
      });

      if (status == google.maps.DirectionsStatus.OK) {
        this.dr.setDirections(response);

        this.distance = response.routes[0].legs[0].distance.text;
        this.time = response.routes[0].legs[0].duration.text;
      }
    })
  }

  onCenterMap() {
    this.map.panTo(this.source);
  }
}
