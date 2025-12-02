import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {ProjectNumberCardData, ProjectNumberCardComponent } from '../project-number-card/project-number-card';
import { CommonModule } from '@angular/common';

export interface ProjectProcessData {
  projectName: string;
  title: string;
  description: string;
  steps: ProjectNumberCardData[];
  backgroundImages?: string[];
}

@Component({
  selector: 'app-project-process',
  imports: [ProjectNumberCardComponent, CommonModule],
  templateUrl: './project-process.html',
  styleUrl: './project-process.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectProcessComponent {
  @Input() projectProcessData: ProjectProcessData = {
    projectName: '',
    title: '',
    description: '',
    steps: [],
  };
}
