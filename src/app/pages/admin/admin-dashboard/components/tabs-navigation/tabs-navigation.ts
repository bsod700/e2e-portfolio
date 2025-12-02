import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export type TabType = 'hero' | 'services' | 'projects' | 'testimonials' | 'faq';

@Component({
  selector: 'app-tabs-navigation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs-navigation.html',
  styleUrl: './tabs-navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TabsNavigationComponent {
  @Input() tabs: readonly TabType[] = [];
  @Input() activeTab: TabType = 'hero';
  @Output() readonly tabChange = new EventEmitter<TabType>();

  onTabClick(tab: TabType): void {
    this.tabChange.emit(tab);
  }
}

