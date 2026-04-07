import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExamDataService } from '../../services/exam-data.service';
import { Assignment, ExamUser, QuestionPaper } from '../../models/exam.model';

export interface AssignDialogData {
  paper?:   QuestionPaper; // optional — when omitted a paper dropdown is shown
  userIds?: string[];       // optional — pre-selects users in the multi-select
}

@Component({
  selector: 'app-assign-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatIconModule,
  ],
  templateUrl: './assign-dialog.component.html',
})
export class AssignDialogComponent implements OnInit {
  users:  ExamUser[]      = [];
  papers: QuestionPaper[] = [];

  selectedUserIds: string[] = []; // multi-select
  selectedPaperId = '';
  error    = '';
  skipped: string[] = []; // names of users who already have an active assignment

  constructor(
    public dialogRef: MatDialogRef<AssignDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AssignDialogData,
    private examData: ExamDataService,
  ) {
    this.selectedUserIds = data.userIds ?? [];
  }

  ngOnInit(): void {
    this.users  = this.examData.users().filter(u => u.role === 'user');
    this.papers = this.examData.papers();
    if (this.data.paper) {
      this.selectedPaperId = this.data.paper.id;
    }

    this.selectedUserIds = this.examData.assignments()
      .filter(a => a.questionPaperId === this.selectedPaperId)
      .map(a => a.userId);
  }

  get fixedPaper(): QuestionPaper | undefined { return this.data.paper; }

  get selectedPaper(): QuestionPaper | undefined {
    return this.papers.find(p => p.id === this.selectedPaperId);
  }

  get timerLabel(): string {
    const t = this.selectedPaper?.timer;
    if (!t?.enabled) return 'No timer';
    const mins = Math.floor((t.durationSeconds ?? 0) / 60);
    return `${mins} min${t.autoSubmit ? ' — Auto-submit' : ' — Warning only'}`;
  }

  async assign(): Promise<void> {
    this.error   = '';
    this.skipped = [];

    if (!this.selectedUserIds.length) { this.error = 'Please select at least one user.'; return; }
    if (!this.selectedPaperId)        { this.error = 'Please select a paper.';           return; }

    const now         = new Date().toISOString();
    const assignments = this.examData.assignments();
    let   assigned    = 0;

    for (const userId of this.selectedUserIds) {
      const hasActive = assignments.some(
        a => a.userId === userId &&
             a.questionPaperId === this.selectedPaperId &&
             (a.status === 'pending' || a.status === 'in_progress'),
      );
      if (hasActive) {
        const name = this.users.find(u => u.id === userId)?.name ?? userId;
        this.skipped.push(name);
        continue;
      }
      await this.examData.saveAssignment({
        id:              this.examData.generateId('asgn'),
        userId,
        questionPaperId: this.selectedPaperId,
        assignedAt:      now,
        status:          'pending',
      });
      assigned++;
    }

    if (assigned === 0) {
      this.error = 'No assignments were created — all selected users already have an active assignment for this paper.';
      return;
    }

    // Close and pass back: number assigned + skipped names for snackbar message
    this.dialogRef.close({ assigned, skipped: this.skipped });
  }
}
