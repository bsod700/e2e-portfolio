import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TabType = 'hero' | 'services' | 'projects' | 'testimonials' | 'faq';

@Component({
  selector: 'app-tabs-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs-navigation.html',
  styleUrl: './tabs-navigation.scss'
})
export class TabsNavigationComponent {
  @Input() tabs: TabType[] = [];
  @Input() activeTab: TabType = 'hero';
  @Output() tabChange = new EventEmitter<TabType>();

  onTabClick(tab: TabType): void {
    this.tabChange.emit(tab);
  }
}

