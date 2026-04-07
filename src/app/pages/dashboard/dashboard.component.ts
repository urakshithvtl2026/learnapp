import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { WordService } from '../../services/word.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  constructor(public wordService: WordService) {}

  async ngOnInit() {
    if (!this.wordService.loaded()) {
      await this.wordService.loadWords();
    }
  }

  get stats() {
    return this.wordService.getStats();
  }
}
