import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/api/queryClient';
import { fetchPostComments, addPostComment } from '@/features/post-comments/api/comments.api.ts';
import { postQueryKeys } from '@/features/posts/queries/postQuery.keys.ts';
import { sumBy } from 'lodash';

const LOAD_MORE_LIMIT = 5;

export function useInfiniteCommentsQuery(postId: number, enabled: boolean) {
	return useInfiniteQuery({
		queryKey: postQueryKeys.comments(postId),
		queryFn: ({ pageParam }) => fetchPostComments(postId, pageParam, LOAD_MORE_LIMIT),
		initialPageParam: 0,
		getNextPageParam: (lastPage, _allPages, lastPageParam) => {
			const totalFetched = sumBy(_allPages, p => p.content.length);
			return totalFetched < lastPage.pagination.total ? lastPageParam + 1 : undefined;
		},
		enabled,
		staleTime: 1000 * 60,
	});
}

export function useAddCommentMutation(postId: number) {
	return useMutation({
		mutationFn: (content: string) => addPostComment(postId, content),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
		},
	});
}
