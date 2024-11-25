import { authorType } from "./AuthorType";

export interface PostType {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  destination: string;
  maxParticipant: number;
  isClosed: boolean;
  views: number;
  likes: number;
  tags: string[];
  author: authorType;
}