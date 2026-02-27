export enum PostSortField {
  TITLE = "TITLE",
  CONTENT = "CONTENT",
  LIKES = "LIKES",
  CREATED = "CREATED",
  UPDATED = "UPDATED",
}

export interface PostSearchRequest {
  title?: string;
  content?: string;
  likes?: number;
  deleted?: boolean;
  keyword?: string;
  sortField?: PostSortField;
}

export interface PostSearchFormValues {
  keyword: string;
  sortField: PostSortField | "";
}
