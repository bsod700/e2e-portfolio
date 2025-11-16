import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProjectCardComponent, Project } from '../../../components/sections';
import { ProjectsService } from '../../../services/projects.service';

@Component({
  selector: 'app-projects-page',
  imports: [
    RouterLink,
    ProjectCardComponent
  ],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss'
})
export class ProjectsPageComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  
  projects: Project[] = [];

  ngOnInit(): void {
    // Initialize with default projects first for immediate render
    this.projects = this.projectsService.getDefaultProjects();
    
    // Then load from service (which may include database updates)
    this.projectsService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.projects = projects;
      },
      error: (error) => {
        console.error('Error loading projects:', error);
        // Already have default projects, so continue
      }
    });
  }
}

