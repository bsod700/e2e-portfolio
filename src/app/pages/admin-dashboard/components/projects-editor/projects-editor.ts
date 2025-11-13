import { Component, Input, Output, EventEmitter, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContentService, ProjectContent } from '../../../../services/content.service';
import { CustomDropdownComponent, DropdownOption } from '../services-editor/custom-dropdown/custom-dropdown';

@Component({
  selector: 'app-projects-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, CustomDropdownComponent],
  templateUrl: './projects-editor.html',
  styleUrl: './projects-editor.scss'
})
export class ProjectsEditorComponent {
  private contentService = inject(ContentService);
  private cdr = inject(ChangeDetectorRef);

  @Input() projects: ProjectContent[] = [];
  @Output() projectsUpdated = new EventEmitter<ProjectContent[]>();

  selectedProjectId: string = '';
  editingProject: ProjectContent | null = null;
  saving = false;
  error = '';
  successMessage = '';

  get dropdownOptions(): DropdownOption[] {
    return this.projects.map(project => ({
      value: project.project_id || '',
      label: project.project_id || 'Untitled Project'
    }));
  }

  onProjectSelect(value: string): void {
    if (!value || value === '' || !value.trim()) {
      this.selectedProjectId = '';
      this.editingProject = null;
      this.cdr.markForCheck();
      return;
    }

    this.selectedProjectId = value.trim();
    const project = this.projects.find(p => p.project_id === this.selectedProjectId);
    
    if (project) {
      this.editingProject = { ...project };
      this.cdr.markForCheck();
    } else {
      this.editingProject = null;
      this.cdr.markForCheck();
    }
  }

  cancelEditProject(): void {
    this.editingProject = null;
    this.selectedProjectId = '';
  }

  async saveProject(): Promise<void> {
    if (!this.editingProject) return;

    this.saving = true;
    this.error = '';
    this.successMessage = '';

    this.contentService.updateProjectContent(this.editingProject).subscribe({
      next: (result) => {
        if (result.success) {
          this.successMessage = 'Project saved successfully!';
          if (result.data) {
            const index = this.projects.findIndex(p => p.project_id === result.data!.project_id);
            if (index >= 0) {
              this.projects[index] = result.data;
            } else {
              this.projects.push(result.data);
            }
          this.projects.sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
          this.projectsUpdated.emit([...this.projects]);
          }
          // Keep the project selected after save
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        } else {
          this.error = result.error || 'Failed to save project';
        }
        this.saving = false;
      },
      error: (error) => {
        console.error('Error saving project:', error);
        this.error = 'Failed to save project';
        this.saving = false;
      }
    });
  }
}

