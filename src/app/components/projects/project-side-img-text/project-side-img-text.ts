import { ChangeDetectionStrategy, Component, Input, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface ProjectSideImgTextData {
  projectName: string;
  title: string;
  text: string;
  image?: string;
  video?: string;
  backgroundImages?: string[];
  circles?: string[];
  sideDirection: 'left' | 'right' | 'column';
  sectionName: string;
}
@Component({
  selector: 'app-project-side-img-text',
  imports: [CommonModule],
  templateUrl: './project-side-img-text.html',
  styleUrl: './project-side-img-text.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectSideImgTextComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

  @Input() projectSideImgTextData: ProjectSideImgTextData = {
    projectName: '',
    title: '',
    text: '',
    backgroundImages: [],
    sideDirection: 'left',
    sectionName: '',
  };

  @ViewChild('videoPlayer') videoPlayer?: ElementRef<HTMLVideoElement>;
  isPlaying = true;

  ngAfterViewInit(): void {
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.addEventListener('play', () => {
        this.isPlaying = true;
        this.cdr.markForCheck();
      });
      this.videoPlayer.nativeElement.addEventListener('pause', () => {
        this.isPlaying = false;
        this.cdr.markForCheck();
      });
    }
  }

  togglePlayPause(): void {
    if (this.videoPlayer?.nativeElement) {
      if (this.videoPlayer.nativeElement.paused) {
        this.videoPlayer.nativeElement.play();
        this.isPlaying = true;
      } else {
        this.videoPlayer.nativeElement.pause();
        this.isPlaying = false;
      }
      this.cdr.markForCheck();
    }
  }
}
