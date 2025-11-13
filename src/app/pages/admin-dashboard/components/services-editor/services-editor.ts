import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, HomeServiceCard } from '../../../../services/content.service';
import { CustomDropdownComponent, DropdownOption } from './custom-dropdown/custom-dropdown';

@Component({
  selector: 'app-services-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDropdownComponent],
  templateUrl: './services-editor.html',
  styleUrl: './services-editor.scss'
})
export class ServicesEditorComponent {
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);

  @Input() homeServices: HomeServiceCard[] = [];
  @Output() servicesUpdated = new EventEmitter<HomeServiceCard[]>();

  selectedServiceId: string = '';
  editingHomeService: HomeServiceCard | null = null;
  saving = false;
  error = '';
  successMessage = '';

  get dropdownOptions(): DropdownOption[] {
    return this.homeServices.map(service => ({
      value: service.service_id,
      label: service.service_id
    }));
  }

  onServiceSelect(value: string): void {
    console.log('=== onServiceSelect START ===');
    console.log('Received value:', value);
    console.log('Type of value:', typeof value);
    console.log('homeServices array:', this.homeServices);
    console.log('homeServices length:', this.homeServices.length);
    
    if (!value || value === '' || !value.trim()) {
      console.log('Empty value, clearing selection');
      this.selectedServiceId = '';
      this.editingHomeService = null;
      this.cdr.markForCheck();
      return;
    }

    this.selectedServiceId = value.trim();
    console.log('Set selectedServiceId to:', this.selectedServiceId);
    
    // Try to find the service
    const service = this.homeServices.find(s => {
      const match = s.service_id === this.selectedServiceId;
      console.log(`Comparing: "${s.service_id}" === "${this.selectedServiceId}" = ${match}`);
      return match;
    });
    
    console.log('Found service:', service);
    
    if (service) {
      console.log('Setting editingHomeService to:', service);
      this.editingHomeService = { ...service };
      console.log('editingHomeService is now:', this.editingHomeService);
      this.cdr.markForCheck();
    } else {
      console.error('Service NOT found!');
      console.error('Searched for:', this.selectedServiceId);
      console.error('Available service_ids:', this.homeServices.map(s => `"${s.service_id}"`));
      this.editingHomeService = null;
      this.cdr.markForCheck();
    }
    console.log('=== onServiceSelect END ===');
  }

  cancelEditHomeService(): void {
    this.editingHomeService = null;
    this.selectedServiceId = '';
  }

  async saveHomeService(): Promise<void> {
    if (!this.editingHomeService) return;

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    this.contentService.updateHomeServiceCard(this.editingHomeService).subscribe({
      next: (result) => {
        if (result.success) {
          this.successMessage = 'Service card saved successfully!';
          if (result.data) {
            const index = this.homeServices.findIndex(s => s.service_id === result.data!.service_id);
            if (index >= 0) {
              this.homeServices[index] = result.data;
            } else {
              this.homeServices.push(result.data);
            }
            this.homeServices.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
            this.servicesUpdated.emit([...this.homeServices]);
          }
          // Keep the service selected after save
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.error = result.error || 'Failed to save service card';
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Error saving service card:', error);
        this.error = 'Failed to save service card';
        this.saving = false;
      }
    });
  }
}

