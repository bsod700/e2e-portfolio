import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PersonaAttribute {
  name?: string;
  value: string;
  icon?: string;
}
export interface ProjectPersonasData {
  projectName: string;
  title?: string;
  text?: string;
  personas: {
    backgroundImages?: string[];
    name: string;
    image: string;
    attributes: PersonaAttribute[];
    wants: PersonaAttribute[];
    frustrations: PersonaAttribute[];
    bio: string;
  }[];
  backgroundImages?: string[];
}
@Component({
  selector: 'app-project-personas',
  imports: [CommonModule],
  templateUrl: './project-personas.html',
  styleUrl: './project-personas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectPersonasComponent {
  @Input() projectPersonasData: ProjectPersonasData = {
    projectName: '',
    title: '',
    text: '',
    personas: [],
  };
}
