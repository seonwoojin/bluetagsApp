enum Survey {
  "FALSE",
  "TRUE",
  "HOLD",
}

export enum d {
  "CREATE",
  "UPDATE",
  "HOUR",
  "DAY",
}

export type Project = {
  id: string;
  key: string;
  title: string;
  logoImage: string;
  backgroundImage: string;
  description: string | null;
  category: string;
  fundingScale: string;
  discordUrl: string | null;
  twitterUrl: string | null;
  openseaUrl: string | null;
  homepageUrl: string | null;
  mediumUrl: string | null;
  telegramUrl: string | null;
  subscriber: number;
};

export type BlueCard = {
  id: string;
  title: string;
  thumbnail: string;
  summary: string;
  description: string;
  bluetags: string[];
  sns: string;
  createdAt: Date;
  deadLineStart: Date | null;
  deadLineEnd: Date | null;
  projectId: string;
  imgURL: string[];
  isUpload: boolean;
  view: number;
  like: number;
  save: number;
  unlike: number;
};

export interface BluecardWithProject extends BlueCard {
  project: Project;
}

export type User = {
  id: string;
  email: string;
  name: string;
  password: string | null;
  profile: string;
  auth: boolean;
  admin: boolean | null;
  createdAt: Date | null;
  readBlueCard: string[];
  subscribe: string[];
  isSocial: boolean;
  calendar: string[];
  survey: Survey;
  like_bluecards: string[];
  unlike_bluecards: string[];
  like_newscards: string[];
  unlike_newscards: string[];
  like_comments: string[];
  unlike_comments: string[];
  save_bluecards: string[];
};

export interface ProjectWithBlueCard extends Project {
  _count: {
    BlueCards: number;
  };
}

export type NewsCard = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  subject: string;
  createdAt: Date;
  imgURL: string[];
  like: number;
  unlike: number;
};

export type Notification = {
  id: string;
  createdAt: Date;
  blueCardId: string;
  projectKey: string;
  projectLogo: string | null;
  projectTitle: string | null;
  title: string;
  thumbnail: string | null;
  role: "CREATE" | "UPDATE" | "HOUR" | "DAY";
};

export type Comment = {
  id: string;
  createdAt: Date;
  userId: string;
  blueCardId: string;
  text: string;
  like: number;
};

export interface CommentWithUser extends Comment {
  user: User;
}
