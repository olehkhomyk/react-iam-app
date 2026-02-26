export type PaginationResponse<T> = {
    content: T[];
    pagination: Pagination;
};

export interface Pagination {
    total: number;
    limit: number;
    page: number;
    pages: number;
}
