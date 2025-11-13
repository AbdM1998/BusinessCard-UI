import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'BusinessCard-UI';

   showAddCard = true;
  showCardList = false;

  
  toggleAddCard(): void {
    this.showAddCard = true;
    this.showCardList = false;
  }
  toggleCardList(): void {
    this.showCardList = true;
    this.showAddCard = false;
  }
}
