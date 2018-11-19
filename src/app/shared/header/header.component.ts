import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() currentSection: number = 0;
  @Input() darkTheme: boolean = false;
  @ViewChild(ModalComponent) modal: ModalComponent;
  toggleAside: boolean = false;

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
  }

  goToSection(event, anchor, section) {
    if (event !== null) {
      event.preventDefault();
    }
    var anchor = document.querySelector(anchor);
    if (anchor != null) {
      anchor.scrollIntoView({
        behavior: 'smooth'
      });
      this.currentSection = section;
    }
  }

  openModal(event) {
    event.preventDefault();
    this.modal.openModal();
  }

  closeModal(event) {
    this.modal.closeModal();
  }

  login() {
    this.router.navigate(['/home']);
  }

  turnAside(event?) {

    if (event !== undefined) {
      event.preventDefault();
    }
    this.toggleAside = !this.toggleAside;
  }

}
