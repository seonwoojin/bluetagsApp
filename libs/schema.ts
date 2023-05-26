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
