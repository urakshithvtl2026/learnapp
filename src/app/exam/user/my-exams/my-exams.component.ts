import { Component, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { ExamDataService } from '../../services/exam-data.service';
import { AuthService } from '../../../services/auth.service';
import { Assignment } from '../../models/exam.model';

@Component({
  selector: 'app-my-exams',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './my-exams.component.html',
  styleUrl: './my-exams.component.scss',
})
export class MyExamsComponent implements OnInit {
  displayedColumns = ['paper', 'status', 'action'];

  examUser = computed(() => {
    const username = this.auth.getUsername() ?? '';
    return this.examData.getUserByUsername(username);
  });

  myAssignments = computed(() => {
    const user = this.examUser();
    if (!user) return [];
    return this.examData
      .assignments()
      .filter(a => a.userId === user.id)
      .sort((a, b) => b.assignedAt.localeCompare(a.assignedAt));
  });

  constructor(
    public examData: ExamDataService,
    private auth: AuthService,
    private router: Router,
  ) {}

  async ngOnInit(): Promise<void> {
    await this.examData.initialize();
  }

  paperTitle(assignment: Assignment): string {
    return this.examData.papers().find(p => p.id === assignment.questionPaperId)?.title ?? '—';
  }

  statusLabel(status: string): string {
    return { pending: 'Pending', in_progress: 'In Progress', completed: 'Completed' }[status] ?? status;
  }

  statusClass(status: string): string {
    return { pending: 'chip-grey', in_progress: 'chip-blue', completed: 'chip-green' }[status] ?? '';
  }

  resultId(assignmentId: string): string | null {
    return this.examData.results().find(r => r.assignmentId === assignmentId)?.id ?? null;
  }

  startOrContinue(assignment: Assignment): void {
    this.router.navigate(['/exam/player', assignment.id]);
  }

  viewResult(assignment: Assignment): void {
    const id = this.resultId(assignment.id);
    if (id) this.router.navigate(['/exam/result', id]);
  }
}
