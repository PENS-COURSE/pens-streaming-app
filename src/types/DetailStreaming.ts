export interface DetailStreaming {
  title?: string;
  description?: string;
  course?: Course;
}

export interface Course {
  title?: string;
  description?: string;
  ratings?: number;
  total_user_rating?: number;
  grade_level?: string;
  user?: null;
}
