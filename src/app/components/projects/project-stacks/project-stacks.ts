import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
export interface ProjectStacksData {
  services: {
    name: string;
    icon: string;
  }[];
  technologies: {
    name: string;
    icon: string;
  }[];
  backgroundImages?: string[];
  projectName: string;
}
@Component({
  selector: 'app-project-stacks',
  imports: [CommonModule],
  templateUrl: './project-stacks.html',
  styleUrl: './project-stacks.scss'
})
export class ProjectStacksComponent {
  @Input() projectStacksData: ProjectStacksData = {
    services: [],
    technologies: [],
    projectName: ''
  };
}
