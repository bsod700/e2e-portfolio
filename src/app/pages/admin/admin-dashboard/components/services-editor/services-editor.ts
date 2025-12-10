import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, HomeServiceCard, ServicesSectionHeader } from '../../../../../services/content.service';
import { CustomDropdownComponent, DropdownOption } from './custom-dropdown/custom-dropdown';
import { finalize, take } from 'rxjs';

@Component({
  selector: 'app-services-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDropdownComponent],
  templateUrl: './services-editor.html',
  styleUrl: './services-editor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ServicesEditorComponent implements OnInit {
  private readonly contentService = inject(ContentService);
  private readonly cdr = inject(ChangeDetectorRef);

  private _homeServices: HomeServiceCard[] = [];

  @Input()
  set homeServices(services: HomeServiceCard[]) {
    this._homeServices = services ?? [];
    this.dropdownOptions = this._homeServices.map((service) => ({
      value: service.service_id,
      label: service.service_id
    }));
  }

  get homeServices(): HomeServiceCard[] {
    return this._homeServices;
  }

  @Output() readonly servicesUpdated = new EventEmitter<HomeServiceCard[]>();

  // Services section header
  servicesHeader: ServicesSectionHeader = {
    kicker: "Product design • Full-stack • AI",
    title: 'Everything Needed to Ship a Digital Product',
    description: 'A complete service stack: design, full-stack development, AI automation, strategy, and brand identity.'
  };
  savingHeader = false;
  headerError = '';
  headerSuccessMessage = '';

  selectedServiceId = '';
  editingHomeService: HomeServiceCard | null = null;
  saving = false;
  error = '';
  successMessage = '';

  ngOnInit(): void {
    this.loadServicesHeader();
  }

  loadServicesHeader(): void {
    this.contentService
      .getServicesSectionHeader()
      .pipe(take(1))
      .subscribe({
        next: (header) => {
          if (header) {
            this.servicesHeader = header;
            this.cdr.markForCheck();
          }
        },
        error: (error) => {
          // Keep a minimal log for diagnostics without spamming the console
          console.error('Error loading services section header:', error);
        }
      });
  }

  saveServicesHeader(): void {
    this.savingHeader = true;
    this.headerError = '';
    this.headerSuccessMessage = '';

    this.contentService
      .updateServicesSectionHeader(this.servicesHeader)
      .pipe(
        take(1),
        finalize(() => {
          this.savingHeader = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (result) => {
          if (result.success) {
            this.headerSuccessMessage = 'Services section header saved successfully!';
            if (result.data) {
              this.servicesHeader = result.data;
            }
            setTimeout(() => {
              this.headerSuccessMessage = '';
              this.cdr.markForCheck();
            }, 3000);
          } else {
            this.headerError = result.error || 'Failed to save header';
          }
        },
        error: (error) => {
          console.error('Error saving services header:', error);
          this.headerError = 'Failed to save header';
        }
      });
  }

  dropdownOptions: DropdownOption[] = [];

  onServiceSelect(value: string): void {
    if (!value || value === '' || !value.trim()) {
      this.selectedServiceId = '';
      this.editingHomeService = null;
      this.cdr.markForCheck();
      return;
    }

    this.selectedServiceId = value.trim();

    const service = this.homeServices.find((s) => s.service_id === this.selectedServiceId);

    if (service) {
      this.editingHomeService = { ...service };
      this.cdr.markForCheck();
    } else {
      this.editingHomeService = null;
      this.cdr.markForCheck();
    }
  }

  cancelEditHomeService(): void {
    this.editingHomeService = null;
    this.selectedServiceId = '';
  }

  saveHomeService(): void {
    if (!this.editingHomeService) {
      return;
    }

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    this.contentService
      .updateHomeServiceCard(this.editingHomeService)
      .pipe(
        take(1),
        finalize(() => {
          this.saving = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: (result) => {
          if (result.success && result.data) {
            const updatedService = result.data;
            const index = this.homeServices.findIndex((s) => s.service_id === updatedService.service_id);

            if (index >= 0) {
              this.homeServices[index] = updatedService;
            } else {
              this.homeServices = [...this.homeServices, updatedService];
            }

            this.homeServices = [...this.homeServices].sort(
              (a, b) => (a.display_order || 0) - (b.display_order || 0)
            );

            this.dropdownOptions = this.homeServices.map((service) => ({
              value: service.service_id,
              label: service.service_id
            }));

            this.servicesUpdated.emit([...this.homeServices]);

            this.successMessage = 'Service card saved successfully!';
            setTimeout(() => {
              this.successMessage = '';
              this.cdr.markForCheck();
            }, 3000);
          } else if (!result.success) {
            this.error = result.error || 'Failed to save service card';
          }
        },
        error: (error) => {
          console.error('Error saving service card:', error);
          this.error = 'Failed to save service card';
        }
      });
  }
}

