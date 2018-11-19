import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() visible: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  closeModal(event?) {
    if (event !== undefined) {
      event.preventDefault();
    }
    this.visible = false;
  }

  openModal() {
    this.visible = true;
  }

}
