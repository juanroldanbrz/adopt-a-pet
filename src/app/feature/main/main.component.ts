import { Component, OnInit, ElementRef, ViewChild, NgZone, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { } from 'google-maps';
import { MapsAPILoader } from '@agm/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})

export class MainComponent implements AfterViewInit {

  sectionProfile: boolean = false;
  @ViewChild('search') searchElementRef: ElementRef;
  public searchControl: FormControl;
  routerActive: string = '';
  searchValue: any = '';
  asideVisible: boolean = false;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone, private route: Router) {
  }


  ngAfterViewInit(): void {
    // this.searchControl = new FormControl();

    // this.mapsAPILoader.load().then(() => {
    //   let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    //     types: ["address"]
    //   });
    //   autocomplete.addListener("place_changed", () => {
    //     this.ngZone.run(() => {
    //       let place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       if (place.geometry === undefined || place.geometry === null) {
    //         return;
    //       }
    //       this.eventService.sendMyObject({ locationSearch: place.geometry.location });

    //     });
    //   });
    // });
  }

  openProfile(event) {
    event.preventDefault();
    this.sectionProfile = true;
  }

  closeProfile() {
    this.sectionProfile = false;
  }

  turnAside(event) {
    event.preventDefault();
    this.asideVisible = !this.asideVisible;
  }
}
