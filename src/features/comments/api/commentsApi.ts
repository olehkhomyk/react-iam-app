import type {Comment} from '@/features/comments/model/Comment';

const MOCK_USERS = ['alice_wonder', 'bob_smith', 'charlie_dev', 'diana_ui', 'edward_ux', 'fiona_doe', 'george_re', 'helen_qa'];

const MOCK_TEXTS = [
	'Great post! Really enjoyed reading this.',
	'Thanks for sharing, very insightful.',
	'I totally agree with this perspective.',
	'This is exactly what I was looking for, thanks!',
	'Interesting take on the topic. Keep it up.',
	'Well written and easy to understand.',
	'Could you elaborate a bit more on this?',
	'Shared this with my team, very useful.',
	'This changed my view on the subject.',
	'Looking forward to more posts like this!',
	'Amazing content as always!',
	'This really resonated with me.',
];

const TOTAL_COMMENTS_PER_POST = 12;

function seededRandom(seed: number): () => number {
	let s = seed;
	return () => {
		s = (s * 1664525 + 1013904223) & 0xffffffff;
		return (s >>> 0) / 0xffffffff;
	};
}

function generateMockComments(postId: number, page: number, limit: number): Comment[] {
	const offset = page * limit;
	const rand = seededRandom(postId * 100 + offset);
	const results: Comment[] = [];

	for (let i = 0; i < limit; i++) {
		const globalIndex = offset + i;
		if (globalIndex >= TOTAL_COMMENTS_PER_POST) break;

		const r = seededRandom(postId * 1000 + globalIndex);
		const userIndex = Math.floor(r() * MOCK_USERS.length);
		const textIndex = Math.floor(r() * MOCK_TEXTS.length);
		const daysAgo = Math.floor(rand() * 30);
		const hoursAgo = Math.floor(rand() * 24);

		const date = new Date();
		date.setDate(date.getDate() - daysAgo);
		date.setHours(date.getHours() - hoursAgo);

		results.push({
			id: postId * 1000 + globalIndex,
			postId,
			content: MOCK_TEXTS[textIndex],
			createdBy: MOCK_USERS[userIndex],
			created: date.toISOString(),
		});
	}

	return results;
}

export interface CommentPage {
	content: Comment[];
	pagination: {
		total: number;
		page: number;
		limit: number;
		pages: number;
	};
}

export async function fetchComments(postId: number, page: number, limit: number): Promise<CommentPage> {
	await new Promise(resolve => setTimeout(resolve, 350));
	return {
		content: generateMockComments(postId, page, limit),
		pagination: {
			total: TOTAL_COMMENTS_PER_POST,
			page,
			limit,
			pages: Math.ceil(TOTAL_COMMENTS_PER_POST / limit),
		},
	};
}

export async function addComment(postId: number, content: string, createdBy: string): Promise<Comment> {
	await new Promise(resolve => setTimeout(resolve, 300));
	return {
		id: Date.now(),
		postId,
		content,
		createdBy,
		created: new Date().toISOString(),
	};
}