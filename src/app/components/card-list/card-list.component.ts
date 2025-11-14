import { Component } from '@angular/core';
import { BusinessCard, BusinessCardFilter, PagedResult } from 'src/app/models/business-card';
import { BusinessCardService } from 'src/app/services/business-card.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.css']
})
export class CardListComponent {
  pagedResult: PagedResult<BusinessCard> = null as any;
  cards: BusinessCard[] = [];
  filteredCards: BusinessCard[] = [];

  filterOptions: BusinessCardFilter = {};
  showFilters = false;
  selectedCard: BusinessCard | null = null;
  pageSize: number = 10;
  totalPages: number = 1;
  pageNumber = 1;
  pageSizeOptions = [5, 10, 20, 50];

  isLoading: boolean = false;

  constructor(private cardService: BusinessCardService) { }

  ngOnInit(): void {
    this.loadCards();

  }

  loadCards(): void {
    this.isLoading = true;
    this.cardService.getAll(this.pageNumber , this.pageSize).subscribe({
      next: (data : PagedResult<BusinessCard>) => {
        this.cards = data.cards  || [];
        this.filteredCards = data.cards || [];
        this.pageNumber = data.pageNumber;
        this.pageSize = data.pageSize;
        this.totalPages = data.totalPages;
        this.isLoading = false;
      },
    error: (err) => {
      this.isLoading = false;
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.error?.message || err?.message || 'Failed to load cards.',
      });
    }
    });
  }
  applyFilter(): void {
    this.isLoading = true;

    this.cardService.filter(this.filterOptions).subscribe({
      next: (data) => {
        this.filteredCards = data;
        this.cards = data;
        this.isLoading = false;
      },
    error: (err) => {
      this.isLoading = false;
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.error?.message || err?.message || 'Failed to filter cards.',
      });
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
        Swal.fire({
          icon: 'success',
          title: 'Filter Applied',
          text: 'Card deleted successfully!',
        });
        this.loadCards();
      },
    error: (err) => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.error?.message || err?.message || 'Failed to delete cards.',
      });
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

onExportFormatChange(event: any , id : any): void {
    const format = event.target.value;
    if (format === 'csv') {
      this.exportCsv(id);
    } else if (format === 'xml') {
      this.exportXml(id);
    }
  }
exportCsv(id: any = null): void {
        this.cardService.exportCsv(id, this.pageNumber, this.pageSize).subscribe({
          next: (data) => {
        const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob , 'business_cards.csv');
      },
    error: (err) => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.error?.message || err?.message || 'Failed to export cards.',
      });
    }
    });
  }

  exportXml(id: any = null): void {
      this.cardService.exportXml(id, this.pageNumber, this.pageSize).subscribe({
      next: (data) => {
        const blob = new Blob([data], { type: 'application/xml;charset=utf-8;' });
        this.downloadFile(blob , 'business_cards.xml');
      },
    error: (err) => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: err?.error?.message || err?.message || 'Failed to export cards.',
      });
    }
    });
  }

    private downloadFile(blob: Blob , filename: string ): void {
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

goToPage(page: number) {
  if (page >= 1 && page <= this.totalPages) {
    this.pageNumber = page;
    this.loadCards();
  }
}

nextPage() {
  this.goToPage(this.pageNumber + 1);
}

prevPage() {
  this.goToPage(this.pageNumber - 1);
}
 onPageSizeChange(event: any): void {
  this.pageSize = Number(event.target.value); 
  this.pageNumber = 1; 
  this.loadCards();
  }
}