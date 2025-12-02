import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { ProjectCardComponent, Project } from '../../../components/sections';
import { ProjectsService } from '../../../services/projects.service';
import { ContactComponent } from '../../../components/sections';
import { take } from 'rxjs';

@Component({
  selector: 'app-projects-page',
  imports: [
    ProjectCardComponent,
    ContactComponent
  ],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent implements OnInit {
  private readonly projectsService = inject(ProjectsService);

  // Initialize with default projects first for immediate render
  projects: Project[] = this.projectsService.getDefaultProjects();

  ngOnInit(): void {
    // Then load from service (which may include database updates)
    this.projectsService.getProjects()
      .pipe(take(1))
      .subscribe({
        next: (projects: Project[]) => {
          this.projects = projects;
        },
        error: (error: unknown) => {
          console.error('Error loading projects:', error);
          // Already have default projects, so continue using them
        }
      });
  }
}

