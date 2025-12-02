import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type MainSection = 'users' | 'content' | 'settings' | 'validation';

export interface NavigationItem {
  id: MainSection;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-main-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main-navigation.html',
  styleUrl: './main-navigation.scss'
})
export class MainNavigationComponent {
  @Input() activeSection: MainSection = 'content';
  @Output() sectionChange = new EventEmitter<MainSection>();

  navigationItems: NavigationItem[] = [
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'content', label: 'Content', icon: '📄' },
    { id: 'validation', label: 'Email Validation', icon: '✉️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  selectSection(section: MainSection): void {
    this.activeSection = section;
    this.sectionChange.emit(section);
  }
}

