import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CtaButtonComponent } from '../../ui';
import { CtaButtonData } from '../../ui/cta-button/cta-button';

export interface ProjectHeaderData {
  name: string;
  title: string;
  description: string;
  logoUrl: string;
  cta?: CtaButtonData,
  img: {
    src: string;
    alt: string;
  };
  backgroundImages?: string[];
}

@Component({
  selector: 'app-project-header',
  imports: [CommonModule, CtaButtonComponent],
  templateUrl: './project-header.html',
  styleUrl: './project-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectHeaderComponent {
  @Input() projectHeaderData: ProjectHeaderData = {
    name: '',
    title: '',
    description: '',
    logoUrl: '',
    img: { src: '', alt: '' }
  };
}

