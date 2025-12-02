import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface ProjectNumberCardData {
  title: string;
  subtitle: string;
  text: string;
  projectName: string;
  backgroundImages?: string[];
}
@Component({
  selector: 'app-project-number-card',
  imports: [CommonModule],
  templateUrl: './project-number-card.html',
  styleUrl: './project-number-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectNumberCardComponent {
  @Input() projectNumberCardData: ProjectNumberCardData = {
    title: '',
    subtitle: '',
    text: '',
    projectName: '',
  };
}
