export type QuestionType = 
  | 'multiple_choice'
  | 'text'
  | 'rating'
  | 'file_upload'
  | 'video'
  | 'boolean'
  | 'number'
  | 'date';

export type QuestionOption = {
  id: string;
  text: string;
  value: string;
  nextQuestionId?: string; // For conditional logic
};

export type QuestionValidation = {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  pattern?: string;
  fileTypes?: string[];
  maxFileSize?: number; // in bytes
  maxDuration?: number; // for video questions, in seconds
};

export type Question = {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  options?: QuestionOption[];
  validation?: QuestionValidation;
  order: number;
  isRequired: boolean;
  score?: number; // For evaluation purposes
  category?: string; // For grouping questions
  tags?: string[]; // For filtering and organization
};

export type SurveyTemplate = {
  id: string;
  name: string;
  description: string;
  industry: string;
  role: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
};

export type Survey = {
  id: string;
  jobId: string;
  title: string;
  description?: string;
  questions: Question[];
  templateId?: string;
  isActive: boolean;
  settings: {
    allowPartialSave: boolean;
    showProgress: boolean;
    timeLimit?: number; // in minutes
    randomizeQuestions: boolean;
    requireAllQuestions: boolean;
  };
  analytics: {
    totalResponses: number;
    averageCompletionTime: number;
    averageScore?: number;
    completionRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
};

export type SurveyResponse = {
  id: string;
  surveyId: string;
  applicantId: string;
  answers: {
    questionId: string;
    value: any;
    score?: number;
    timeSpent?: number; // in seconds
  }[];
  status: 'draft' | 'submitted' | 'evaluated';
  startedAt: Date;
  submittedAt?: Date;
  evaluatedAt?: Date;
  totalScore?: number;
  evaluationNotes?: string;
};

export type SurveyAnalytics = {
  surveyId: string;
  totalResponses: number;
  completionRate: number;
  averageScore: number;
  questionAnalytics: {
    questionId: string;
    responseCount: number;
    averageScore?: number;
    distribution?: Record<string, number>; // For multiple choice questions
    averageTimeSpent?: number;
  }[];
  timeAnalytics: {
    averageCompletionTime: number;
    medianCompletionTime: number;
    completionTimeDistribution: Record<string, number>;
  };
  scoreAnalytics: {
    averageScore: number;
    medianScore: number;
    scoreDistribution: Record<string, number>;
  };
}; 