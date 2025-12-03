import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectNutshellData {
  title: string;
  text: string;
  projectName: string;
}

@Component({
  selector: 'app-project-nutshell',
  imports: [CommonModule],
  templateUrl: './project-nutshell.html',
  styleUrl: './project-nutshell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectNutshellComponent {
  @Input() projectNutshellData: ProjectNutshellData = {
    title: '',
    text: '',
    projectName: '',
  };
}
