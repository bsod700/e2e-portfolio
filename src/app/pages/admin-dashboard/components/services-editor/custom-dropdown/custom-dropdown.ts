import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DropdownOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-custom-dropdown',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-dropdown.html',
  styleUrl: './custom-dropdown.scss'
})
export class CustomDropdownComponent implements OnChanges, OnInit {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = '-- Select an option --';
  @Input() selectedValue: string = '';
  @Input() label: string = '';
  @Input() id: string = '';

  @Output() valueChange = new EventEmitter<string>();

  isOpen = false;
  focusedIndex = -1;
  internalSelectedValue: string = '';

  ngOnInit(): void {
    this.internalSelectedValue = this.selectedValue;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedValue']) {
      this.internalSelectedValue = this.selectedValue;
    }
  }

  get selectedOption(): DropdownOption | undefined {
    return this.options.find(opt => opt.value === this.internalSelectedValue);
  }

  get displayText(): string {
    return this.selectedOption?.label || this.placeholder;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.focusedIndex = this.internalSelectedValue 
        ? this.options.findIndex(opt => opt.value === this.internalSelectedValue)
        : -1;
    }
  }

  selectOption(option: DropdownOption, event?: MouseEvent): void {
    console.log('=== selectOption START ===');
    console.log('Option received:', option);
    console.log('Option value:', option.value);
    console.log('Event received:', event);
    console.log('Event type:', event?.type);
    
    if (event) {
      event.stopPropagation();
      event.preventDefault();
      console.log('Stopped propagation and prevented default');
    }
    
    // Immediately update the internal value
    this.internalSelectedValue = option.value;
    console.log('Set internalSelectedValue to:', this.internalSelectedValue);
    
    // Emit immediately
    console.log('About to emit valueChange with:', option.value);
    console.log('EventEmitter exists?', !!this.valueChange);
    
    try {
      this.valueChange.emit(option.value);
      console.log('✅ Successfully emitted valueChange event with value:', option.value);
    } catch (error) {
      console.error('❌ Error emitting valueChange:', error);
    }
    
    // Close dropdown immediately
    this.isOpen = false;
    this.focusedIndex = -1;
    console.log('Dropdown closed');
    console.log('=== selectOption END ===');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Don't close if clicking inside the dropdown
    if (!target.closest('.custom-dropdown')) {
      this.isOpen = false;
      this.focusedIndex = -1;
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isOpen && (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      this.toggleDropdown();
      return;
    }

    if (!this.isOpen) return;

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.isOpen = false;
        this.focusedIndex = -1;
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = Math.min(this.focusedIndex + 1, this.options.length - 1);
        this.scrollToFocused();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.focusedIndex = Math.max(this.focusedIndex - 1, 0);
        this.scrollToFocused();
        break;
      case 'Enter':
        event.preventDefault();
        if (this.focusedIndex >= 0 && this.focusedIndex < this.options.length) {
          this.selectOption(this.options[this.focusedIndex], undefined);
        }
        break;
      case 'Home':
        event.preventDefault();
        this.focusedIndex = 0;
        this.scrollToFocused();
        break;
      case 'End':
        event.preventDefault();
        this.focusedIndex = this.options.length - 1;
        this.scrollToFocused();
        break;
    }
  }

  private scrollToFocused(): void {
    setTimeout(() => {
      const focusedElement = document.querySelector(`.custom-dropdown-option[data-index="${this.focusedIndex}"]`);
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }, 0);
  }

  onOptionMouseEnter(index: number): void {
    this.focusedIndex = index;
  }
}

