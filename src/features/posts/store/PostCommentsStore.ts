import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/app/api/queryClient';
import { fetchComments, addComment } from '@/features/comments/api/commentsApi';
import { postQueryKeys } from '@/features/posts/store/postQueryKeys';
import { sumBy } from 'lodash';

const LOAD_MORE_LIMIT = 5;

export function useInfiniteCommentsQuery(postId: number, enabled: boolean) {
	return useInfiniteQuery({
		queryKey: postQueryKeys.comments(postId),
		queryFn: ({ pageParam }) => fetchComments(postId, pageParam, LOAD_MORE_LIMIT),
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
		mutationFn: (content: string) => addComment(postId, content),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
		},
	});
}