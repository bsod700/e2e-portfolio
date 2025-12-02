import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectSideImgCardsData {
  projectName: string;
  title: string;
  text?: string;
  sideDirection: 'left' | 'right';
  cards: {
    backgroundImages?: string[];
    title: string;
    text: string;
    icon: string;
  }[];
  image: string;
  backgroundImages?: string[];
  sectionName: string;
  backgroundCircles?: string[];
}
@Component({
  selector: 'app-project-side-img-cards',
  imports: [CommonModule],
  templateUrl: './project-side-img-cards.html',
  styleUrl: './project-side-img-cards.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSideImgCardsComponent {
  @Input() projectSideImgCardsData: ProjectSideImgCardsData = {
    projectName: '',
    title: '',
    sideDirection: 'left',
    cards: [],
    image: '',
    sectionName: '',
  };
}
