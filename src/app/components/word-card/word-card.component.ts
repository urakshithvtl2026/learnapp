import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Word } from '../../models/word.model';

@Component({
  selector: 'app-word-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './word-card.component.html',
  styleUrl: './word-card.component.scss',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(8px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class WordCardComponent {
  word = input.required<Word>();
  remaining = input.required<number>();
  total = input.required<number>();
  learntCount = input.required<number>();
  skippedCount = input.required<number>();

  skip = output<void>();
  learnt = output<void>();
  next = output<void>();

  showDescription = false;

  reveal() {
    this.showDescription = true;
  }

  onSkip() {
    this.showDescription = false;
    this.skip.emit();
  }

  onLearnt() {
    this.showDescription = false;
    this.learnt.emit();
  }

  onNext() {
    this.showDescription = false;
    this.next.emit();
  }
}
