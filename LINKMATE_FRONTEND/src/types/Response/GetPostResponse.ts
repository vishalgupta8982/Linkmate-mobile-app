interface Comment {
	commentId: string;
	userId: string;
	content: string;
	createdAt: string;
}

interface FeedItem {
	postId: string;
	userId: string;
	content: string;
	createdAt: string;
	fileType: string;
	fileUrl: string;
	likedBy: string[];
	comments: Comment[];
}

interface Pageable {
	offset: number;
	pageNumber: number;
	pageSize: number;
	paged: boolean;
	unpaged: boolean;
	sort: Sort;
}

interface Sort {
	empty: boolean;
	sorted: boolean;
	unsorted: boolean;
}

export interface PostDataResponse {
	content: FeedItem[];
	pageable: Pageable;
	totalPages: number;
	totalElements: number;
	last: boolean;
	size: number;
	number: number;
	sort: Sort;
	first: boolean;
	numberOfElements: number;
	empty: boolean;
}
