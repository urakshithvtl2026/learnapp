import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { ExamDataService } from '../../services/exam-data.service';
import { AnswerRecord, ExamResult, QuestionPaper } from '../../models/exam.model';

@Component({
  selector: 'app-result-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './result-view.component.html',
  styleUrl: './result-view.component.scss',
})
export class ResultViewComponent implements OnInit {
  result: ExamResult | null = null;
  paper: QuestionPaper | null = null;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examData: ExamDataService,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.examData.initialize();
    const resultId = this.route.snapshot.paramMap.get('resultId')!;
    this.result = this.examData.results().find(r => r.id === resultId) ?? null;
    if (!this.result) { this.error = 'Result not found.'; return; }
    this.paper = this.examData.papers().find(p => p.id === this.result!.questionPaperId) ?? null;
  }

  get scoreClass(): string {
    if (!this.result) return '';
    if (this.result.score >= 70) return 'score-pass';
    if (this.result.score >= 40) return 'score-mid';
    return 'score-fail';
  }

  questionText(questionId: string): string {
    return this.paper?.questions.find(q => q.id === questionId)?.text ?? questionId;
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  // User sees which they got right/wrong but NOT correct answer for wrong ones
  answerLabel(a: AnswerRecord): string {
    return `Selected: ${a.selectedOptionId.toUpperCase()}`;
  }

  selectedOptionText(a: AnswerRecord): string {
    const q = this.paper?.questions.find(q => q.id === a.questionId);
    return q?.options.find(o => o.id === a.selectedOptionId)?.text ?? '';
  }

  backToExams(): void {
    this.router.navigate(['/exam/my-exams']);
  }
}
