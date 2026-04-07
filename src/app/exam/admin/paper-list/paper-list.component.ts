import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ExamDataService } from '../../services/exam-data.service';
import { QuestionPaper } from '../../models/exam.model';
import { AssignDialogComponent } from '../assign-dialog/assign-dialog.component';

@Component({
  selector: 'app-paper-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatTableModule, MatButtonModule, MatIconModule,
    MatCardModule, MatTooltipModule,
  ],
  templateUrl: './paper-list.component.html',
  styleUrl: './paper-list.component.scss',
})
export class PaperListComponent implements OnInit {
  displayedColumns = ['index', 'title', 'questions', 'timer', 'assigned', 'actions'];

  papersWithStats = computed(() => {
    const papers      = this.examData.papers();
    const assignments = this.examData.assignments();
    return papers.map(p => ({
      ...p,
      assignedCount: assignments.filter(a => a.questionPaperId === p.id).length,
      hasCompleted:  assignments.some(a => a.questionPaperId === p.id && a.status === 'completed'),
    }));
  });

  constructor(
    private examData: ExamDataService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.examData.initialize();
  }

  timerLabel(paper: QuestionPaper): string {
    if (!paper.timer.enabled) return 'Off';
    const mins = Math.floor((paper.timer.durationSeconds ?? 0) / 60);
    return `${mins} min`;
  }

  openAssign(paper: QuestionPaper): void {
    this.dialog
      .open(AssignDialogComponent, { data: { paper }, width: '420px' })
      .afterClosed()
      .subscribe((result?: { assigned: number; skipped: string[] }) => {
        if (!result) return;
        const msg = result.skipped.length
          ? `Assigned to ${result.assigned} user(s). Skipped (already active): ${result.skipped.join(', ')}.`
          : `Assigned to ${result.assigned} user(s).`;
        this.snack.open(msg, 'OK', { duration: 4000 });
      });
  }

  async deletePaper(paper: QuestionPaper & { hasCompleted: boolean }): Promise<void> {
    if (paper.hasCompleted) {
      this.snack.open('Cannot delete — paper has completed assignments.', 'OK', { duration: 3000 });
      return;
    }
    if (!confirm(`Delete "${paper.title}"?`)) return;
    await this.examData.deletePaper(paper.id);
    this.snack.open('Paper deleted.', 'OK', { duration: 2000 });
  }
}
