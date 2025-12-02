import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export interface ProjectSideTextsData {
  titleLeft: string;
  titleRight: string;
  textLeft: string;
  textRight: string;
}
@Component({
  selector: 'app-project-side-texts',
  imports: [],
  templateUrl: './project-side-texts.html',
  styleUrl: './project-side-texts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSideTextsComponent {
  @Input() projectSideTextsData: ProjectSideTextsData = {
    titleLeft: '',
    titleRight: '',
    textLeft: '',
    textRight: '',
  };
}
