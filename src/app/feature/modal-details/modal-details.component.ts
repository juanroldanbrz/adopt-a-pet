import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-details',
  templateUrl: './modal-details.component.html',
  styleUrls: ['./modal-details.component.scss']
})
export class ModalDetailsComponent implements OnInit {

  @Input() visible: boolean = false;
  @Output() onCloseModal: EventEmitter<any> = new EventEmitter();
  @ViewChild('input') inputMessage;
  @Input() isProfile: boolean = false;
  @Input() data: any;
  statusSelectorCity: boolean = false;
  statusSelectorCountry: boolean = false;

  msg: any = [{
    you: true,
    msg: 'Hi there :D',
  },
  {
    you: false,
    msg: 'Hi there :D',
  },
  ];

  constructor() { }

  ngOnInit() {
  }

  flipCard(event) {
    if (event !== undefined) {
      event.preventDefault();
    }
    var card = document.querySelector('.umf-details__perspective');
    card.setAttribute('class', 'umf-details__perspective umf-details__perspective--flip');
    setTimeout(() => {
      card.querySelector('.umf-details__back').setAttribute('style', 'z-index:15');
    }, 200);
  }

  backFlip(event) {
    if (event !== undefined) {
      event.preventDefault();
    }
  }

  activeFormProposal(event) {
    if (event !== undefined) {
      event.preventDefault();
    }
    var card = document.querySelector('.umf-details__perspective');
    card.setAttribute('class', 'umf-details__perspective umf-details__perspective--flip-top');
  }

  sendMessage(value) {
    if (value.length !== 0) {
      this.msg.push({
        you: true,
        msg: value
      });
      this.inputMessage.nativeElement.value = '';
    }
  }

  closeModal() {
    this.onCloseModal.emit();
  }

  turnSelectorCity() {
    this.statusSelectorCity = !this.statusSelectorCity;
  }

  turnSelectorCountry() {
    this.statusSelectorCountry = !this.statusSelectorCountry;
  }


}
