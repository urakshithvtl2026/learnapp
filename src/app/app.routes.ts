import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.component').then(m => m.SignupComponent),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'learn',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/learn/learn.component').then(m => m.LearnComponent),
  },

  // ── Admin: User management ───────────────────────────────────────────────
  {
    path: 'admin/users',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./admin/user-management/user-management.component').then(m => m.UserManagementComponent),
  },

  // ── Exam: Admin-only routes (role: admin required) ────────────────────────
  {
    path: 'exam/admin',
    canActivate: [adminGuard],
    children: [
      // Paper management, assignment, results — admin only
      { path: 'papers',      loadComponent: () => import('./exam/admin/paper-list/paper-list.component').then(m => m.PaperListComponent) },
      { path: 'papers/:id',  loadComponent: () => import('./exam/admin/paper-editor/paper-editor.component').then(m => m.PaperEditorComponent) },
      { path: 'assignments', loadComponent: () => import('./exam/admin/assignments-list/assignments-list.component').then(m => m.AssignmentsListComponent) },
      { path: 'results',     loadComponent: () => import('./exam/admin/results-dashboard/results-dashboard.component').then(m => m.ResultsDashboardComponent) },
      { path: '', redirectTo: 'papers', pathMatch: 'full' },
    ],
  },

  // ── Exam: User routes (any authenticated user, role: user) ────────────────
  {
    path: 'exam',
    canActivate: [authGuard],
    children: [
      { path: 'my-exams',             loadComponent: () => import('./exam/user/my-exams/my-exams.component').then(m => m.MyExamsComponent) },
      { path: 'player/:assignmentId', loadComponent: () => import('./exam/user/exam-player/exam-player.component').then(m => m.ExamPlayerComponent) },
      { path: 'result/:resultId',     loadComponent: () => import('./exam/user/result-view/result-view.component').then(m => m.ResultViewComponent) },
      { path: '', redirectTo: 'my-exams', pathMatch: 'full' },
    ],
  },
];
