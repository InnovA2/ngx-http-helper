export class PaginatedData<T> {
    totalItems!: number;
    items!: T[];
    totalPages!: number;
    currentPage!: number;
    hasPreviousPage!: boolean;
    hasNextPage!: number;
}
