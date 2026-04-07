import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { ExamDataService } from '../../services/exam-data.service';
import { ExamResult } from '../../models/exam.model';

@Component({
  selector: 'app-results-dashboard',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatTableModule, MatFormFieldModule,
    MatSelectModule, MatIconModule, MatButtonModule, MatTooltipModule,
  ],
  templateUrl: './results-dashboard.component.html',
  styleUrl: './results-dashboard.component.scss',
})
export class ResultsDashboardComponent implements OnInit {
  displayedColumns = ['user', 'paper', 'score', 'timeTaken', 'timedOut', 'submitted'];

  filterUserId  = signal('');
  filterPaperId = signal('');

  filteredResults = computed(() => {
    let results = this.examData.results();
    if (this.filterUserId())  results = results.filter(r => r.userId === this.filterUserId());
    if (this.filterPaperId()) results = results.filter(r => r.questionPaperId === this.filterPaperId());
    return results.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
  });

  users  = computed(() => this.examData.users().filter(u => u.role === 'user'));
  papers = computed(() => this.examData.papers());

  constructor(private examData: ExamDataService) {}

  async ngOnInit(): Promise<void> {
    await this.examData.initialize();
  }

  userName(userId: string): string {
    return this.examData.users().find(u => u.id === userId)?.name ?? userId;
  }

  paperTitle(paperId: string): string {
    return this.examData.papers().find(p => p.id === paperId)?.title ?? paperId;
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  /** Full breakdown for admin tooltip */
  breakdown(result: ExamResult): string {
    return result.answers
      .map(a => `${a.questionId}: ${a.selectedOptionId} — ${a.isCorrect ? '✓' : '✗'}`)
      .join('\n');
  }

  scoreClass(score: number): string {
    if (score >= 70) return 'score-pass';
    if (score >= 40) return 'score-mid';
    return 'score-fail';
  }
}
