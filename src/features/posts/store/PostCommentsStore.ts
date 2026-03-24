import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/api/queryClient';
import { fetchComments, addComment } from '@/features/comments/api/commentsApi';
import { postQueryKeys } from '@/features/posts/store/postQueryKeys';

const INITIAL_LIMIT = 3;
const LOAD_MORE_LIMIT = 5;

export function useCommentsQuery(postId: number, page: number) {
	return useQuery({
		queryKey: postQueryKeys.commentsPage(postId, page),
		queryFn: () => {
			const limit = page === 0 ? INITIAL_LIMIT : LOAD_MORE_LIMIT;
			return fetchComments(postId, page, limit);
		},
		staleTime: 1000 * 60,
	});
}

export function useAddCommentMutation(postId: number) {
	return useMutation({
		mutationFn: ({ content, createdBy }: { content: string; createdBy: string }) =>
			addComment(postId, content, createdBy),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
		},
	});
}