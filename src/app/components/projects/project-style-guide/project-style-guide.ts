import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Input } from '@angular/core';

export interface ProjectStyleGuideData {
  projectName: string;
  title: string;
  text: string;
  fontGuideTitle: string;
  fontGuide: string[];
  colorGuideTitle: string;
  colorGuide: {
    title: string;
    colors: {
      name: string;
      value: string;
    }[];
  }[];
}
@Component({
  selector: 'app-project-style-guide',
  imports: [CommonModule],
  templateUrl: './project-style-guide.html',
  styleUrl: './project-style-guide.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectStyleGuideComponent {
  @Input() projectStyleGuideData: ProjectStyleGuideData = {
    projectName: '',
    title: '',
    text: '',
    fontGuideTitle: '',
    fontGuide: [],
    colorGuideTitle: '',
    colorGuide: [],
  };
}
