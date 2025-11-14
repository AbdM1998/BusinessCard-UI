import { Component, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BusinessCardCreate } from 'src/app/models/business-card';
import { FormBuilder, Validators } from '@angular/forms';
import { BusinessCardService } from 'src/app/services/business-card.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-card-form',
  templateUrl: './card-form.component.html',
  styleUrls: ['./card-form.component.css']
})
export class CardFormComponent {
cardForm!: FormGroup;
  previewCard: BusinessCardCreate | null = null;
  photoPreview: string | null = null;
  importedCards: BusinessCardCreate[] = [];
  showCardPreview = false;
  showImportedList = false;
  importedFile: File | null = null;
  constructor(
    private fb: FormBuilder,
    private cardService: BusinessCardService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.cardForm = this.fb.group({
      name: ['', Validators.required],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]+$/)]],
      address: [''],
      photo: ['']
    });
  }

  onFileSelected(event: any): void {
  const file = event.target.files[0];
  if (file) {
    if (file.name.endsWith('.xml') || file.name.endsWith('.csv')) {
      this.handleFileImport(file);
    }else{
     this.handlePhotoUpload(file);
    } 
  }
}
  handlePhotoUpload(file: any) {
      if (file.size > 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Photo size should not exceed 1MB.',
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.photoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileImport(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  async handleFileImport(file: File): Promise<void> {
    if (file.name.endsWith('.csv') || file.name.endsWith('.xml')) {
      try {
        this.importedCards = await this.cardService.parseFile(file);
        if (this.importedCards.length > 0) {
            this.importedFile = file;
            this.showImportedList = true;
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:'Error parsing file. Please check the format.',
        });
      }
    }
  }

  showPreview(card: BusinessCardCreate): void {
    this.previewCard = card;
    this.cardForm.patchValue({
      name: card.name,
      gender: card.gender,
      dateOfBirth: card.dateOfBirth,
      email: card.email,
      phone: card.phone,
      address: card.address,
      photo: card.photo
    });
    if (card.photo) {
      this.photoPreview = card.photo;
    }
    this.showCardPreview = !this.showCardPreview;
  }

  onSubmit(): void {
    Object.keys(this.cardForm.controls).forEach(key => {
      this.cardForm.get(key)?.markAsTouched();
    });
    if (this.cardForm.valid) {
      this.showPreview(this.cardForm.value);
    }
  }

  submit(): void {
    const cardData: BusinessCardCreate = this.cardForm.value;

    this.cardService.create(cardData).subscribe({
      next: (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Business card created successfully!',
        });
        this.resetForm();
        this.closeCardView();
      }
    });
  }
  resetForm(): void {
    this.cardForm.reset();
    this.previewCard = null;
    this.photoPreview = null;
    this.importedCards = [];
  } 

    closeCardView() {
  this.previewCard = null;
  this.showCardPreview = false;
}

submitAllImportedCards(): void {
    if (this.importedCards.length === 0) {
      return;
    }
    if(this.importedFile) {
      this.cardService.importFile(this.importedFile).subscribe({
        next: (response: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Imported business cards successfully!',
          });
          this.resetForm();
          this.closeImportedList();
        }
      });
    }
  }

closeImportedList(): void {
    this.showImportedList = false;
    this.importedCards = [];
  }
  removeCard(index: number): void {
    this.importedCards.splice(index, 1);
    if (this.importedCards.length === 0) {
      this.closeImportedList();
    }
  }
}
