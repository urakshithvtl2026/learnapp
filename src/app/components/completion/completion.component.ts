import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

export type ResetAction = 'skipped' | 'learnt' | 'all';

@Component({
  selector: 'app-completion',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './completion.component.html',
  styleUrl: './completion.component.scss',
})
export class CompletionComponent {
  total = input.required<number>();
  learntCount = input.required<number>();
  skippedCount = input.required<number>();

  reset = output<ResetAction>();
}
