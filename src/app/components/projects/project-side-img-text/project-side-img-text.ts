import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectSideImgTextData {
  projectName: string;
  title: string;
  text: string;
  image?: string;
  video?: string;
  backgroundImages?: string[];
  circles?: string[];
  sideDirection: 'left' | 'right' | 'column';
  sectionName: string;
}
@Component({
  selector: 'app-project-side-img-text',
  imports: [CommonModule],
  templateUrl: './project-side-img-text.html',
  styleUrl: './project-side-img-text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSideImgTextComponent {
  @Input() projectSideImgTextData: ProjectSideImgTextData = {
    projectName: '',
    title: '',
    text: '',
    backgroundImages: [],
    sideDirection: 'left',
    sectionName: '',
  };
}
