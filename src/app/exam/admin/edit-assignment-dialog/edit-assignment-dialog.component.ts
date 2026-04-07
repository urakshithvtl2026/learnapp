import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ExamDataService } from '../../services/exam-data.service';
import { Assignment, AssignmentStatus, ExamUser, QuestionPaper } from '../../models/exam.model';

export interface EditAssignmentDialogData {
  assignment: Assignment;
}

@Component({
  selector: 'app-edit-assignment-dialog',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatDialogModule, MatFormFieldModule, MatSelectModule,
    MatButtonModule, MatIconModule,
  ],
  templateUrl: './edit-assignment-dialog.component.html',
})
export class EditAssignmentDialogComponent implements OnInit {
  users:  ExamUser[]      = [];
  papers: QuestionPaper[] = [];

  selectedUserId  = '';
  selectedPaperId = '';
  selectedStatus: AssignmentStatus = 'pending';

  readonly statusOptions: { value: AssignmentStatus; label: string }[] = [
    { value: 'pending',     label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
  ];

  error   = '';
  warning = '';

  constructor(
    public dialogRef: MatDialogRef<EditAssignmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditAssignmentDialogData,
    private examData: ExamDataService,
  ) {
    // Set selected values in the constructor — before any template rendering.
    // mat-select stores the value and matches it once mat-options register themselves.
    const a = data.assignment;
    this.selectedUserId  = a.userId;
    this.selectedPaperId = a.questionPaperId;
    this.selectedStatus  = a.status;
  }

  async ngOnInit(): Promise<void> {
    await this.examData.initialize();
    this.users  = this.examData.users().filter(u => u.role === 'user');
    this.papers = this.examData.papers();
    this.refreshWarning();
  }

  get selectedPaper(): QuestionPaper | undefined {
    return this.papers.find(p => p.id === this.selectedPaperId);
  }

  get selectedUser(): ExamUser | undefined {
    return this.users.find(u => u.id === this.selectedUserId);
  }

  get timerLabel(): string {
    const t = this.selectedPaper?.timer;
    if (!t?.enabled) return 'No timer';
    const mins = Math.floor((t.durationSeconds ?? 0) / 60);
    return `${mins} min${t.autoSubmit ? ' — Auto-submit' : ' — Warning only'}`;
  }

  onAnyChange(): void {
    this.error = '';
    this.refreshWarning();
  }

  private refreshWarning(): void {
    const orig = this.data.assignment;
    const msgs: string[] = [];

    if (this.selectedStatus === 'pending' && orig.status !== 'pending') {
      msgs.push('Resetting to Pending allows the user to retake this exam. Any existing result record is kept but will appear orphaned.');
    }
    if (orig.status === 'in_progress' && this.selectedStatus !== 'in_progress') {
      msgs.push('This exam is currently In Progress. The user\'s draft answers in localStorage will become orphaned.');
    }
    if (this.selectedUserId !== orig.userId || this.selectedPaperId !== orig.questionPaperId) {
      msgs.push('Changing the user or paper reassigns this slot. The original user\'s progress on the old paper is unaffected.');
    }
    this.warning = msgs.join(' ');
  }

  async save(): Promise<void> {
    if (!this.selectedUserId)  { this.error = 'Please select a user.';  return; }
    if (!this.selectedPaperId) { this.error = 'Please select a paper.'; return; }

    const orig = this.data.assignment;
    const userChanged  = this.selectedUserId  !== orig.userId;
    const paperChanged = this.selectedPaperId !== orig.questionPaperId;

    // If user or paper changed and the new combo is already active, block it
    if ((userChanged || paperChanged) &&
        (this.selectedStatus === 'pending' || this.selectedStatus === 'in_progress')) {
      const conflict = this.examData.assignments().some(
        a => a.id !== orig.id &&
             a.userId === this.selectedUserId &&
             a.questionPaperId === this.selectedPaperId &&
             (a.status === 'pending' || a.status === 'in_progress'),
      );
      if (conflict) {
        this.error = 'That user already has an active assignment for the selected paper.';
        return;
      }
    }

    const updated: Assignment = {
      ...orig,
      userId:          this.selectedUserId,
      questionPaperId: this.selectedPaperId,
      status:          this.selectedStatus,
    };
    await this.examData.saveAssignment(updated);
    this.dialogRef.close(true);
  }
}
