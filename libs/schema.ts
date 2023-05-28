enum Survey {
  "FALSE",
  "TRUE",
  "HOLD",
}

export type Project = {
  id: string;
  key: string;
  chain: string;
  title: string;
  logoUrl: string;
  description: string | null;
  backGround: string;
  discordUrl: string | null;
  twitterUrl: string | null;
  openseaUrl: string | null;
  homepageUrl: string | null;
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
  unlike: number;
};

export interface BluecardWithProject extends BlueCard {
  project: Project;
}

export type User = {
  id: string;
  email: string;
  name: string;
  password: string;
  profile: string;
  auth: boolean;
  admin: boolean | null;
  createdAt: Date | null;
  readBlueCard: string[];
  subscribe: string[];
  isSocial: boolean;
  calendar: string[];
  survey: Survey;
  like_bluecard: string[];
  unlike_bluecard: string[];
  like_newscard: string[];
  unlike_newscard: string[];
};

export type SocialUser = {
  id: string;
  email: string;
  name: string;
  profile: string;
  createdAt: Date | null;
  readBlueCard: string[];
  subscribe: string[];
  isSocial: boolean;
  calendar: string[];
  survey: Survey;
  like_bluecard: string[];
  unlike_bluecard: string[];
  like_newscard: string[];
  unlike_newscard: string[];
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
