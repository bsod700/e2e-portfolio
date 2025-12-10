import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-strategy-visual',
  standalone: true,
  templateUrl: './strategy-visual.html',
  styleUrl: './strategy-visual.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StrategyVisualComponent {}

