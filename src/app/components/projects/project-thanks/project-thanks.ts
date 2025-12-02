import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ProjectInquiryComponent } from '../../ui';
import { CommonModule } from '@angular/common';

export interface ProjectThanksData {
  projectName: string;
  title: string;
  backgroundImages?: string[];
  backgroundCircles?: string[];
  projectKicker: string;
  projectTitle: string;
  projectDescription: string;
}

@Component({
  selector: 'app-project-thanks',
  imports: [ProjectInquiryComponent, CommonModule],
  templateUrl: './project-thanks.html',
  styleUrl: './project-thanks.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectThanksComponent {
  @Input() projectThanksData: ProjectThanksData = {
    projectName: '',
    title: '',
    projectKicker: '',
    projectTitle: '',
    projectDescription: '',
  };
}
