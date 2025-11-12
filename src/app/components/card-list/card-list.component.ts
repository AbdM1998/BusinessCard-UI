import { Component } from '@angular/core';
import { BusinessCard, BusinessCardFilter } from 'src/app/models/business-card';
import { BusinessCardService } from 'src/app/services/business-card.service';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent {
  cards: BusinessCard[] = [];
  filteredCards: BusinessCard[] = [];

  filterOptions: BusinessCardFilter = {};
  showFilters = false;
  selectedCard: BusinessCard | null = null;
  
  constructor(private cardService: BusinessCardService) { }

  ngOnInit(): void {
    this.loadCards();
  }

  loadCards(): void {
    this.cardService.getAll().subscribe({
      next: (data) => {
        this.cards = data;
        this.filteredCards = data;
      }
    });
  }
  applyFilter(): void {
    this.cardService.filter(this.filterOptions).subscribe({
      next: (data) => {
        this.filteredCards = data;
        this.cards = data;
      }
    });
  }
  clearFilters(): void {
    this.filterOptions = {};
    this.filteredCards = this.cards;
  }
  deleteCard(id: number): void {
    this.cardService.delete(id).subscribe({
      next: () => {
        this.loadCards();
      }
    });
  }
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }
  viewCard(id: number): void {
    this.selectedCard = this.filteredCards.find(c => c.id === id) || null;
  }
  closeCardView() {
  this.selectedCard = null;
}
}
