import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../services/projects.service';

@Component({
  selector: 'app-project-header',
  imports: [CommonModule],
  templateUrl: './project-header.html',
  styleUrl: './project-header.scss'
})
export class ProjectHeaderComponent {
  @Input() project!: Project;
}

