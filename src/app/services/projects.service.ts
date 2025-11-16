import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ContentService, ProjectContent } from './content.service';

export interface Project {
  type: string;
  title: string;
  description: string;
  logoUrl?: string;
  backgroundImages?: string[];
  link?: string;
  img?: {
    src: string;
    alt: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private contentService = inject(ContentService);

  // Default projects data
  private defaultProjects: Project[] = [
    {
      type: 'tierro',
      title: 'Building a Custom Music Platform from Scratch',
      description: 'Full-scale digital brand for music producer Tierro. Custom website, integrated music player, brand identity, and backend systems built end to end.',
      logoUrl: 'assets/images/projects/project-logo-tierro.svg',
      img: {
        src: 'assets/images/projects/project-card-tierro-img-1.webp',
        alt: 'Tierro project image',
      },
      link: '/projects/tierro'
    },
    {
      type: 'prompt-management',
      title: 'Complete Prompt Management Solution',
      description: 'Built a personal prompt library extension for ChatGPT. Custom UI/UX design and full development to organize and manage prompts efficiently.',
      logoUrl: 'assets/images/projects/project-logo-p.webp',
      img: {
        src: 'assets/images/projects/project-card-p-img-1.webp',
        alt: 'Prompt management project image',
      },
      link: '/projects/prompt-management'
    },
    {
      type: 'landerx',
      title: 'End-to-End SaaS Platform for Marketing',
      description: 'Co-founded and developed an AI-powered marketing platform. Automated workflows generate high-performance landing pages, content, and campaigns for small business clients.',
      logoUrl: 'assets/images/projects/project-logo-landerx.svg',
      img: {
        src: 'assets/images/projects/project-card-landerx-img-1.webp',
        alt: 'Landerx project image',
      },
      link: '/projects/landerx'
    },
    {
      type: 'brush-along',
      title: 'Interactive Brushing Tracker for Children',
      description: 'Created an engaging game app that turns dental care into play. Helps parents track progress while keeping children motivated and consistent.',
      logoUrl: 'assets/images/projects/project-logo-brushalong.webp',
      img: {
        src: 'assets/images/projects/project-card-brushalong-img-1.webp',
        alt: 'Brush along project image',
      },
      link: '/projects/brush-along'
    }
  ];

  /**
   * Get all projects, loading from database if available, otherwise using default data
   */
  getProjects(): Observable<Project[]> {
    return this.contentService.getProjectsContent().pipe(
      map((projectsFromDb: ProjectContent[]) => {
        if (projectsFromDb && projectsFromDb.length > 0) {
          // Merge database projects with defaults
          const mergedProjects = this.mergeProjectsWithDatabase(projectsFromDb);
          // Sort by display_order if available
          return this.sortProjects(mergedProjects, projectsFromDb);
        }
        return this.defaultProjects;
      }),
      catchError((error) => {
        console.error('Error loading projects from database:', error);
        // Return default projects if database fails
        return of(this.defaultProjects);
      })
    );
  }

  /**
   * Get projects synchronously (for initial render)
   */
  getDefaultProjects(): Project[] {
    return [...this.defaultProjects];
  }

  /**
   * Merge database projects with default projects
   */
  private mergeProjectsWithDatabase(projectsFromDb: ProjectContent[]): Project[] {
    const mergedProjects: Project[] = [];

    // Start with default projects
    const defaultProjectsMap = new Map<string, Project>();
    this.defaultProjects.forEach(project => {
      defaultProjectsMap.set(project.type, { ...project });
    });

    // Update or add projects from database
    projectsFromDb.forEach((dbProject) => {
      const existingProject = defaultProjectsMap.get(dbProject.project_id || dbProject.type);
      
      if (existingProject) {
        // Update existing project with database data
        existingProject.title = dbProject.title || existingProject.title;
        existingProject.description = dbProject.description || existingProject.description;
        
        if (dbProject.logo_url) {
          existingProject.logoUrl = dbProject.logo_url;
        }
        
        if (dbProject.image_src) {
          existingProject.img = {
            src: dbProject.image_src,
            alt: dbProject.image_alt || dbProject.title || 'Project image'
          };
        }
        
        if (dbProject.background_images) {
          existingProject.backgroundImages = dbProject.background_images;
        }
        
        // Only update link if it's a valid specific project link (not just '/projects')
        if (dbProject.link && dbProject.link !== '/projects' && dbProject.link.startsWith('/projects/')) {
          existingProject.link = dbProject.link;
        } else if (!existingProject.link) {
          // If no link exists, use the default specific project link
          existingProject.link = `/projects/${existingProject.type}`;
        }
        // Otherwise, keep the existing default link
        
        mergedProjects.push(existingProject);
      } else {
        // Add new project from database
        const projectType = dbProject.project_id || dbProject.type;
        // Use database link only if it's a valid specific project link, otherwise use default format
        let projectLink = `/projects/${projectType}`;
        if (dbProject.link && dbProject.link !== '/projects' && dbProject.link.startsWith('/projects/')) {
          projectLink = dbProject.link;
        }
        
        const newProject: Project = {
          type: projectType,
          title: dbProject.title,
          description: dbProject.description,
          logoUrl: dbProject.logo_url || '',
          img: {
            src: dbProject.image_src || '',
            alt: dbProject.image_alt || dbProject.title || 'Project image'
          },
          backgroundImages: dbProject.background_images || [],
          link: projectLink
        };
        mergedProjects.push(newProject);
      }
    });

    // Add any default projects not in database
    defaultProjectsMap.forEach((project, type) => {
      if (!projectsFromDb.find(p => (p.project_id || p.type) === type)) {
        mergedProjects.push(project);
      }
    });

    return mergedProjects;
  }

  /**
   * Sort projects by display_order from database
   */
  private sortProjects(projects: Project[], projectsFromDb: ProjectContent[]): Project[] {
    return projects.sort((a, b) => {
      const aOrder = projectsFromDb.find(p => (p.project_id || p.type) === a.type)?.display_order || 999;
      const bOrder = projectsFromDb.find(p => (p.project_id || p.type) === b.type)?.display_order || 999;
      return aOrder - bOrder;
    });
  }
}

