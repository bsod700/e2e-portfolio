import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CtaButtonComponent } from '../../../ui';

export interface Project {
  title: string;
  description: string;
  logoUrl?: string;
  backgroundImages?: string[];
  link?: string;
  type: string;
  img?: {
    src: string;
    alt: string;
  };
  services?: string[];
}

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, CtaButtonComponent, CommonModule],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss'
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Input() isActive: boolean = false;
  @Input() isProjectsPage: boolean = false;
}

