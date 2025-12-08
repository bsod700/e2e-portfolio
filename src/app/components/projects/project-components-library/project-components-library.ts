import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


export interface ProjectComponentsLibraryData {
  projectName: string;
  title: string;
  text: string;
  images: { src: string; alt: string }[];
  backgroundImages?: string[];
  circles?: string[];
  sectionName: string;
}

@Component({
  selector: 'app-project-components-library',
  imports: [CommonModule],
  templateUrl: './project-components-library.html',
  styleUrl: './project-components-library.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectComponentsLibraryComponent {
  @Input() projectComponentsLibraryData: ProjectComponentsLibraryData = {
    projectName: '',
    title: '',
    text: '', 
    images: [],
    backgroundImages: [],
    circles: [],
    sectionName: '',
  };
}
