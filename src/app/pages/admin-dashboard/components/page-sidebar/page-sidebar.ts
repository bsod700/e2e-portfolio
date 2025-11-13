import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PageType = 'home' | 'accessibility-statement' | 'privacy-policy' | 'terms-conditions';

export interface Page {
  id: PageType;
  name: string;
  tabs: string[]; // Can be empty or contain tab names
}

@Component({
  selector: 'app-page-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-sidebar.html',
  styleUrl: './page-sidebar.scss'
})
export class PageSidebarComponent {
  @Input() pages: Page[] = [];
  @Input() activePage: PageType = 'home';
  @Output() pageChange = new EventEmitter<PageType>();

  onPageClick(pageId: PageType): void {
    this.pageChange.emit(pageId);
  }
}

