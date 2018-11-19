import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'

import { AppComponent } from './app.component';
import { LandingComponent } from './feature/landing/landing.component';
import { ModalComponent } from './shared/modal/modal.component';
import { FollowCursorDirective } from './shared/follow-cursor.directive';
import { MainComponent } from './feature/main/main.component';
import { HeaderComponent } from './shared/header/header.component';
import { EventsComponent } from './feature/events/events.component';
import { ExploreComponent } from './feature/explore/explore.component';
import { CalendarComponent } from './shared/calendar/calendar.component';
import { MypetsComponent } from './feature/mypets/mypets.component';
import { FriendsComponent } from './feature/friends/friends.component';
import { ModalDetailsComponent } from './feature/modal-details/modal-details.component';
import { AgmOverlays } from "agm-overlays"
import { EvcCarouselModule } from './shared/carousel/carousel.module';

const appRoutes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: '*', component: LandingComponent, pathMatch: 'full' },
  {
    path: 'home', component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full',
      },
      {
        path: 'explore',
        component: ExploreComponent,

      },
      {
        path: 'events',
        component: EventsComponent,

      },
      {
        path: 'friends',
        component: FriendsComponent,
      },
      {
        path: 'mypets',
        component: MypetsComponent,
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ModalComponent,
    FollowCursorDirective,
    MainComponent,
    HeaderComponent,
    EventsComponent,
    ExploreComponent,
    CalendarComponent,
    MypetsComponent,
    FriendsComponent,
    ModalDetailsComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AgmOverlays,
    ReactiveFormsModule,
    EvcCarouselModule,
    RouterModule.forRoot(
      appRoutes, { useHash: false }
    ),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC34iKoWlXUUMFnAxuhkN8834zBNF_WtFY',
      libraries: ['places', 'geometry']
    }),
    AgmDirectionModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [GoogleMapsAPIWrapper],
  bootstrap: [AppComponent]
})
export class AppModule { }
