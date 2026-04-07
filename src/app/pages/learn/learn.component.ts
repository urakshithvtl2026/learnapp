import { Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { WordService } from '../../services/word.service';
import { WordCardComponent } from '../../components/word-card/word-card.component';
import { CompletionComponent, ResetAction } from '../../components/completion/completion.component';

@Component({
  selector: 'app-learn',
  standalone: true,
  imports: [MatProgressSpinnerModule, WordCardComponent, CompletionComponent],
  templateUrl: './learn.component.html',
  styleUrl: './learn.component.scss',
})
export class LearnComponent implements OnInit {
  constructor(public wordService: WordService) {}

  async ngOnInit() {
    if (!this.wordService.loaded()) {
      await this.wordService.loadWords();
    }
  }

  onReset(action: ResetAction) {
    switch (action) {
      case 'skipped': this.wordService.resetSkipped(); break;
      case 'learnt':  this.wordService.resetLearnt();  break;
      case 'all':     this.wordService.resetAll();     break;
    }
  }

  get stats() {
    return this.wordService.getStats();
  }
}
