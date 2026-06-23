import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/api/queryClient';
import { addPostComment, fetchCommentReplies } from '@/features/post-comments/api/comments.api.ts';
import { postQueryKeys } from '@/features/posts/queries/postQuery.keys.ts';
import { sumBy } from 'lodash';

const LOAD_MORE_LIMIT = 5;

export function useInfiniteRepliesQuery(postId: number, commentId: number, enabled: boolean) {
	return useInfiniteQuery({
		queryKey: postQueryKeys.replies(postId, commentId),
		queryFn: ({ pageParam }) => fetchCommentReplies(postId, commentId, pageParam, LOAD_MORE_LIMIT),
		initialPageParam: 0,
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			const totalFetched = sumBy(_allPages, p => p.content.length);
			return totalFetched < lastPage.pagination.total ? lastPageParam + 1 : undefined;
		},
		select: (data) => ({
			...data,
			pagination: data.pages[0]?.pagination,
		}),
		enabled,
		staleTime: 1000 * 60,
	});
}

export function useAddReplyMutation(postId: number, commentId: number) {
	return useMutation({
		mutationFn: (content: string) => addPostComment(postId, content, commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.replies(postId, commentId) });
			queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
		},
	});
}
