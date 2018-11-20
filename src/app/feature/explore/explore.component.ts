import { Component, OnInit, ElementRef, ViewChild, NgZone, AfterContentInit, AfterViewInit } from '@angular/core';
import { } from 'google-maps';
import { MapsAPILoader, AgmMarker, AgmMap, GoogleMapsAPIWrapper } from '@agm/core';
import { animals } from '../../data/animals';
import { mapStyle } from '../../data/mapStyle';
declare var google: any;


@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],

})
export class ExploreComponent implements OnInit, AfterViewInit {

  @ViewChild('map') map: AgmMap;
  animalSelected: any;


  markerCustom: object = {
    url: 'assets/images/marker.png',
    scaledSize: {
      height: 20,
      width: 20
    }
  };

  mapStyle: object = mapStyle;

  radius: number = 200;
  myLatlng: any;
  lat: number = 51.678418;
  lng: number = 7.809007;
  lines: any;
  data: any = animals;
  animalsNearby: Array<any>;
  mapLayout: ElementRef;
  sectionDetails: boolean = false;
  hoverAnimal: any = -1;
  enableGeologation: boolean = false;
  myLocation: any;
  locationPet: any;
  transitOptions: string = 'TRANSIT';
  renderOptions: any = {
    polylineOptions: {
      strokeColor: '#aaa',
      strokeOpacity: .5,
      strokeWeight: 5,
    },
    suppressMarkers: true
  };


  constructor(private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private _loader: GoogleMapsAPIWrapper) {
    this.animalsNearby = new Array<Object>();
    this.lines = new Array<Object>();
  }

  ngOnInit() {
    this.lat = 37.4079488;
    this.lng = -5.9777024;
    this.enableGeologation = true;
    this.myLocation = { lat: this.lat, lng: this.lng };
    this.locationPet = { lat: 37.40882358587817, lng: -5.976111888885498 }


    /*if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.enableGeologation = true;
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        },
        (err) => {
          console.log(err);
          this.enableGeologation = false;
        }
      );
    } else {
      console.log('browser not supported');
      this.enableGeologation = false;
    }*/
  }

  ngAfterViewInit(): void {
    this.mapsAPILoader.load().then(() => {
      this.myLatlng = new google.maps.LatLng(this.lat, this.lng);

    });
  }

  /*getCoords(e) {
  
    if (typeof (this.myLatlng) !== 'undefined') {
  
      let latlngCenter = new google.maps.LatLng(parseFloat(e.lat), parseFloat(e.lng));
  
      for (var i = 0; i < this.data.length; i++) {
        // Get animal position and convert to LatLng
        var animalLatlng = new google.maps.LatLng(this.data[i].lat, this.data[i].lng);
        if (google.maps.geometry.spherical.computeDistanceBetween(animalLatlng, latlngCenter) <= this.radius) {
          //get distance (animal near u)
          var distance = (google.maps.geometry.spherical.computeDistanceBetween(animalLatlng, this.myLatlng) / 1000).toFixed(2);
  
          //round distance
          if (distance != null) {
            this.data[i].distance = distance;
          } else {
            this.data[i].distance = 0;
          }
          //check if exists in list and push!
          this.checkIfExists(this.data[i]);
        }
      }
      this.getZipCode(animalLatlng);
    } else {
      console.log('undefined')
    }
  }*/

  // dragEnd(event) {
  //   this.lines.push({ lat: event.coords.lat, lng: event.coords.lng });
  // }

  checkIfExists(data: any) {
    var index = this.animalsNearby.findIndex(item => item.id === data.id);
    if (index > -1) {
    } else {
      this.animalsNearby.push(data);
    }
  }


  private getZipCode(latLng) {
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'location': latLng }, (results, status) => {
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          for (var i = 0; i < results[0].address_components.length; i++) {
            var types = results[0].address_components[i].types;
            for (var typeIdx = 0; typeIdx < types.length; typeIdx++) {
              if (types[typeIdx] == 'postal_code') {
                console.log(results[0].address_components[i].long_name);
                console.log(results[0].address_components[i].short_name);
              }
            }
          }
        } else {
          console.log("No results found");
        }
      }
    });
  }

  checkMarkersInBounds(bounds) {
    for (let item of this.data) {
      let companyPosition = { lat: item.lat, lng: item.lng };
      if (bounds.contains(companyPosition)) {
        var animalLatlng = new google.maps.LatLng(companyPosition.lat, companyPosition.lng);
        var distance = (google.maps.geometry.spherical.computeDistanceBetween(animalLatlng, this.myLatlng) / 1000).toFixed(2);
        distance !== null ? item.distance = distance : item.distance = 0;
        this.checkIfExists(item);
        this.getZipCode(companyPosition);
      }
    }
  }

  openSectionDetails(event, item) {
    if (event !== undefined && event.preventDefault) {
      event.preventDefault();
    }
    this.animalSelected = item;
    this.sectionDetails = true;
  }

  closeSectionDetails(event?) {
    if (event !== undefined) {
      event.preventDefault();
    }
    this.sectionDetails = false;
  }

  setHoverElement(event, item, animal) {
    this.hoverAnimal = item;
    this.locationPet = { lat: animal.lat, lng: animal.lng };
  }

  setCenter() {
    // this.myLatlng = new google.maps.LatLng(this.lat, this.lng);
    this._loader.setCenter(this.myLatlng);
  }

}
