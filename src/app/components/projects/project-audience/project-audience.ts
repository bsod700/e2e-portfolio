import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectAudienceData {
  projectName: string;
  title?: string;
  text?: string;
  sideLeftTitle: string;
  backgroundCircles?: string[];
  sideLeftCards: {
    backgroundImages?: string[];
    title: string;
    text: string;
    icon: string;
  }[];
  sideRightTitle: string;
  sideRightCards: {
    backgroundImages?: string[];
    title: string;
    text: string;
    icon: string;
  }[];
}
@Component({
  selector: 'app-project-audience',
  imports: [CommonModule],
  templateUrl: './project-audience.html',
  styleUrl: './project-audience.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectAudienceComponent {
  @Input() projectAudienceData: ProjectAudienceData = {
    projectName: '',
    sideLeftTitle: '',
    sideLeftCards: [],
    sideRightTitle: '',
    sideRightCards: [],
  };
}
