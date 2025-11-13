import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CtaButtonComponent } from '../../cta-button/cta-button';

export interface Project {
  title: string;
  description: string;
  logoUrl?: string;
  backgroundImages?: string[];
  link?: string;
  type?: 'tierro' | 'prompt-management' | 'default';
}

@Component({
  selector: 'app-project-card',
  imports: [RouterLink, CtaButtonComponent],
  templateUrl: './project-card.html',
  styleUrl: './project-card.scss'
})
export class ProjectCardComponent {
  @Input() project!: Project;
  @Input() isActive: boolean = false;
}

