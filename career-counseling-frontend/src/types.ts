export interface Question {
  id: number;
  text: string;
  category: string;
  options: Option[];
}

export interface Option {
  id: number;
  text: string;
}

export interface Career {
  id: number;
  title: string;
  description: string;
  required_skills?: string;
  education_path?: string;
  salary_range?: string;
  demand?: string;
}

export interface Recommendation {
  career: Career;
  match_score: number;
}

export interface TestSubmission {
  user_id: number;
  answers: Array<{
    question_id: number;
    option_id: number;
  }>;
}

export interface UserRegistration {
  username: string;
  email: string;
  password: string;
}