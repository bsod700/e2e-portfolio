import { Component, Input } from '@angular/core';

export interface ProjectNutshellData {
  title: string;
  text: string;
}

@Component({
  selector: 'app-project-nutshell',
  imports: [],
  templateUrl: './project-nutshell.html',
  styleUrl: './project-nutshell.scss'
})
export class ProjectNutshellComponent {
  @Input() projectNutshellData: ProjectNutshellData = {
    title: '',
    text: '',
  };
}
