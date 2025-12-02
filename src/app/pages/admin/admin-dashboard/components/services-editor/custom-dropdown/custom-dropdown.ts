import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
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
  styleUrl: './custom-dropdown.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomDropdownComponent implements OnChanges, OnInit {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = '-- Select an option --';
  @Input() selectedValue: string = '';
  @Input() label: string = '';
  @Input() id: string = '';

  @Output() readonly valueChange = new EventEmitter<string>();

  isOpen = false;
  focusedIndex = -1;
  internalSelectedValue = '';

  ngOnInit(): void {
    this.internalSelectedValue = this.selectedValue;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedValue']) {
      this.internalSelectedValue = this.selectedValue;
    }
  }

  get selectedOption(): DropdownOption | undefined {
    return this.options.find((opt) => opt.value === this.internalSelectedValue);
  }

  get displayText(): string {
    return this.selectedOption?.label ?? this.placeholder;
  }

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.focusedIndex = this.internalSelectedValue
        ? this.options.findIndex((opt) => opt.value === this.internalSelectedValue)
        : -1;
    }
  }

  selectOption(option: DropdownOption, event?: MouseEvent): void {
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Avoid unnecessary work and emissions when selecting the same value
    if (option.value === this.internalSelectedValue) {
      this.closeDropdown();
      return;
    }

    this.internalSelectedValue = option.value;
    this.valueChange.emit(option.value);

    this.closeDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    // Don't close if clicking inside the dropdown
    if (target && !target.closest('.custom-dropdown')) {
      this.closeDropdown();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (
      !this.isOpen &&
      (event.key === 'Enter' ||
        event.key === ' ' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp')
    ) {
      event.preventDefault();
      this.toggleDropdown();
      return;
    }

    if (!this.isOpen) {
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.focusedIndex = Math.min(
          this.focusedIndex + 1,
          this.options.length - 1,
        );
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
          this.selectOption(this.options[this.focusedIndex]);
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
      default:
        break;
    }
  }

  onOptionMouseEnter(index: number): void {
    this.focusedIndex = index;
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.focusedIndex = -1;
  }

  private scrollToFocused(): void {
    // Defer to the next frame so the DOM has updated before querying
    requestAnimationFrame(() => {
      const focusedElement = document.querySelector(
        `.custom-dropdown-option[data-index="${this.focusedIndex}"]`,
      );
      if (focusedElement) {
        focusedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    });
  }
}

