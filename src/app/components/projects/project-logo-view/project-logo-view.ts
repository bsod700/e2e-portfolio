import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectLogoViewData {
  projectName: string;
  title: string;
  logosView: (string | { src: string; alt: string })[];
  text?: string;
  backgroundImages?: string[];
}

@Component({
  selector: 'app-project-logo-view',
  imports: [CommonModule],
  templateUrl: './project-logo-view.html',
  styleUrl: './project-logo-view.scss'
})
export class ProjectLogoViewComponent {
  @Input() projectLogoViewData: ProjectLogoViewData = {
    projectName: '',
    title: '',
    logosView: [],
    text: ''
  };
}
