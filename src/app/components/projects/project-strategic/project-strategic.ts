import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectNumberCardData, ProjectNumberCardComponent } from '../project-number-card/project-number-card';

export interface ProjectStrategicData {
  title: string;
  text: string;
  cards: ProjectNumberCardData[];
  backgroundImages?: string[];
  projectName: string;
}
@Component({
  selector: 'app-project-strategic',
  imports: [CommonModule, ProjectNumberCardComponent],
  templateUrl: './project-strategic.html',
  styleUrl: './project-strategic.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectStrategicComponent {
  @Input() projectStrategicData: ProjectStrategicData = {
    title: '',
    text: '',
    cards: [],
    projectName: '',
  };
}
