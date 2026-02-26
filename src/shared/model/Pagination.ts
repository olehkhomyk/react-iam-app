export interface PaginationData<T> {
    content: T[];
    pagination: {
        total: number;
        limit: number;
        page: number;
        pages: number;
    };
}

export type PaginatedResponse<T> = {
    content: T[];
    pagination: {
        total: number;
        limit: number;
        page: number;
        pages: number;
    };
};
