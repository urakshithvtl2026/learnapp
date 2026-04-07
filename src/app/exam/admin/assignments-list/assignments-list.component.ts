import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExamDataService } from '../../services/exam-data.service';
import { Assignment, AssignmentStatus } from '../../models/exam.model';
import { AssignDialogComponent } from '../assign-dialog/assign-dialog.component';
import {
  EditAssignmentDialogComponent,
} from '../edit-assignment-dialog/edit-assignment-dialog.component';

@Component({
  selector: 'app-assignments-list',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatTableModule, MatCardModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatSelectModule, MatTooltipModule,
  ],
  templateUrl: './assignments-list.component.html',
  styleUrl: './assignments-list.component.scss',
})
export class AssignmentsListComponent implements OnInit {
  displayedColumns = ['user', 'paper', 'status', 'assignedAt', 'actions'];

  filterUserId  = signal('');
  filterPaperId = signal('');
  filterStatus  = signal('');

  readonly statusOptions: { value: AssignmentStatus | ''; label: string }[] = [
    { value: '',            label: 'All Statuses' },
    { value: 'pending',     label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed',   label: 'Completed' },
  ];

  filteredAssignments = computed(() => {
    let list = this.examData.assignments();
    if (this.filterUserId())  list = list.filter(a => a.userId === this.filterUserId());
    if (this.filterPaperId()) list = list.filter(a => a.questionPaperId === this.filterPaperId());
    if (this.filterStatus())  list = list.filter(a => a.status === this.filterStatus());
    return list.sort((a, b) => b.assignedAt.localeCompare(a.assignedAt));
  });

  users  = computed(() => this.examData.users().filter(u => u.role === 'user'));
  papers = computed(() => this.examData.papers());

  constructor(
    public examData: ExamDataService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.examData.initialize();
  }

  // ── Display helpers ────────────────────────────────────────────────────────

  userName(userId: string): string {
    return this.examData.users().find(u => u.id === userId)?.name ?? userId;
  }

  paperTitle(paperId: string): string {
    return this.examData.papers().find(p => p.id === paperId)?.title ?? paperId;
  }

  statusLabel(s: string): string {
    return { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' }[s] ?? s;
  }

  statusClass(s: string): string {
    return { pending: 'chip-grey', in_progress: 'chip-blue', completed: 'chip-green' }[s] ?? '';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  openNewAssignment(): void {
    this.dialog
      .open(AssignDialogComponent, { data: {}, width: '420px' })
      .afterClosed()
      .subscribe((result?: { assigned: number; skipped: string[] }) => {
        if (!result) return;
        const msg = result.skipped.length
          ? `Assigned to ${result.assigned} user(s). Skipped (already active): ${result.skipped.join(', ')}.`
          : `Assigned to ${result.assigned} user(s).`;
        this.snack.open(msg, 'OK', { duration: 4000 });
      });
  }

  openEdit(assignment: Assignment): void {
    this.dialog
      .open(EditAssignmentDialogComponent, { data: { assignment }, width: '460px' })
      .afterClosed()
      .subscribe(ok => {
        if (ok) this.snack.open('Assignment updated.', 'OK', { duration: 2500 });
      });
  }

  async delete(assignment: Assignment): Promise<void> {
    const statusMessages: Record<AssignmentStatus, string> = {
      pending:     `Delete this pending assignment for "${this.userName(assignment.userId)}"?`,
      in_progress: `This exam is currently In Progress. Deleting it will remove the assignment but draft answers may remain in the user's browser. Continue?`,
      completed:   `This assignment is completed. The result record will remain but be unlinked. Delete anyway?`,
    };

    if (!confirm(statusMessages[assignment.status])) return;

    await this.examData.deleteAssignment(assignment.id);
    this.snack.open('Assignment deleted.', 'OK', { duration: 2500 });
  }
}
