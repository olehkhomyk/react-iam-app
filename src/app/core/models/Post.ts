export interface Post {
    id: number;
    title: string;
    content: string;
    likes: number;
    created: string;
    updated: string;
    isDeleted: boolean;
    createdBy: string;
}

export interface PostsPayload {
    content: Post[];
    pagination: Pagination;
}

export interface Pagination {
    total: number;
    limit: number;
    page: number;
    pages: number;
}
