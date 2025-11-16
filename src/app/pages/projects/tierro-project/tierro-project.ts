import { Component, OnInit, inject } from '@angular/core';
import { ProjectHeaderComponent } from '../../../components/projects';
import { ProjectsService, Project } from '../../../services/projects.service';

@Component({
  selector: 'app-tierro-project',
  imports: [ProjectHeaderComponent],
  templateUrl: './tierro-project.html',
  styleUrl: './tierro-project.scss'
})
export class TierroProjectComponent implements OnInit {
  private projectsService = inject(ProjectsService);
  project: Project | null = null;

  ngOnInit(): void {
    // Load the tierro project data
    this.projectsService.getProjects().subscribe({
      next: (projects: Project[]) => {
        this.project = projects.find(p => p.type === 'tierro') || null;
      },
      error: (error) => {
        console.error('Error loading project:', error);
        // Fallback to default project
        const defaultProjects = this.projectsService.getDefaultProjects();
        this.project = defaultProjects.find(p => p.type === 'tierro') || null;
      }
    });
  }
}
