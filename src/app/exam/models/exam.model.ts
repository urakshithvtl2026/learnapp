export interface Option {
  id: string; // 'a' | 'b' | 'c' | 'd'
  text: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string; // never sent to exam player UI
}

export interface TimerConfig {
  enabled: boolean;
  durationSeconds: number | null;
  autoSubmit: boolean;
}

export interface QuestionPaper {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  timer: TimerConfig;
  questions: Question[];
}

export interface ExamUser {
  id: string;
  username: string; // matches auth username
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export type AssignmentStatus = 'pending' | 'in_progress' | 'completed';

export interface Assignment {
  id: string;
  userId: string;
  questionPaperId: string;
  assignedAt: string;
  status: AssignmentStatus;
}

export interface AnswerRecord {
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
}

export interface ExamResult {
  id: string;
  assignmentId: string;
  userId: string;
  questionPaperId: string;
  startedAt: string;
  submittedAt: string;
  timeTakenSeconds: number;
  timedOut: boolean;
  totalQuestions: number;
  correct: number;
  wrong: number;
  score: number; // 0–100
  answers: AnswerRecord[];
}

// Questions delivered to the exam player — correctOptionId is stripped
export interface QuestionForPlayer {
  id: string;
  text: string;
  options: Option[];
}

// Persisted to localStorage during active exam
export interface TimerState {
  assignmentId: string;
  startedAt: string;
  remainingSeconds: number;
}

// Draft answers persisted during an active exam
export type DraftAnswers = Record<string, string>; // questionId → selectedOptionId
