import { useState, useMemo } from "react";
import { flatMap, isNil, take } from "lodash";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Send } from "lucide-react";
import { useAuth } from "@/features/auth/context/useAuth.ts";
import type { PostComment } from "@/features/post-comments/model/postComment.ts";
import { PostCommentAvatar } from "@/features/post-comments/ui/PostCommentAvatar";
import { useInfiniteCommentsQuery, useAddCommentMutation } from "@/features/posts/queries/postComments.queries.ts";
import { PostCommentItem } from "@/features/post-comments/ui/PostCommentItem";
import { queryClient } from "@/app/api/queryClient.ts";
import { postQueryKeys } from "@/features/posts/queries/postQuery.keys.ts";

const PREVIEW_COUNT = 3;

interface PostCommentsProps {
	postId: number;
	initialComments?: PostComment[];
	totalComments: number;
	showLikes?: boolean;
	readonly?: boolean;
	newCommentAdded?: (comment: PostComment) => void;
}

export function PostComments({
	                             postId,
	                             totalComments = 0,
	                             initialComments,
	                             showLikes = true,
	                             readonly = false,
	                             newCommentAdded,
                             }: PostCommentsProps) {
	const { user } = useAuth();
	const currentUser = user?.username ?? "me";

	const [useInternalComments, setUseInternalComments] = useState<boolean>(isNil(initialComments));
	const [expanded, setExpanded] = useState(false);
	const [commentText, setCommentText] = useState("");

	const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteCommentsQuery(postId, useInternalComments);
	const addCommentMutation = useAddCommentMutation(postId);

	const commentsData = useMemo(() => {
		if (!isNil(data?.pages)) {
			return flatMap(data?.pages, (page) => page.content) ?? [];
		}

		return initialComments ?? [];
	}, [data, initialComments]);

	const displayedComments = expanded ? commentsData : take(commentsData, PREVIEW_COUNT);
	let canLoadMore = false;

	if (!readonly) {
		canLoadMore = expanded ? hasNextPage : totalComments > PREVIEW_COUNT;
	}

	const markViewToUseInternalCommentsQuery = (): void =>  {
		if (!useInternalComments) {
			setUseInternalComments(true);
		}
	}

	const handleLoadMore = () => {
		if (!expanded) {
			setExpanded(true);
			markViewToUseInternalCommentsQuery();
			return;
		}
		fetchNextPage();
	};

	const handleShowLess = () => {
		setExpanded(false);
	};

	const handleSubmit = () => {
		const trimmed = commentText.trim();
		if (!trimmed || addCommentMutation.isPending) return;
		addCommentMutation.mutate(trimmed, {
			onSuccess: (comment: PostComment) => {
				setCommentText("");
				markViewToUseInternalCommentsQuery();
				queryClient.invalidateQueries({ queryKey: postQueryKeys.comments(postId) });
				newCommentAdded?.(comment);
			},
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	};

	return (
		<div className="border-t border-gray-100 px-4 sm:px-5 pt-4 pb-4 space-y-4">
			{!readonly && (
				<div className="flex gap-3">
					<PostCommentAvatar
						user={currentUser}
						className="mt-1"
						fallbackClassName="bg-gradient-to-br from-blue-500 to-purple-600"
					/>
					<div className="flex-1 space-y-2">
						<Textarea
							placeholder="Write a comment... (Enter to submit, Shift+Enter for new line)"
							value={commentText}
							onChange={(e) => setCommentText(e.target.value)}
							onKeyDown={handleKeyDown}
							className="min-h-[64px] resize-none text-sm bg-gray-50 border-gray-200 focus-visible:bg-white"
						/>
						<div className="flex justify-end">
							<Button
								size="sm"
								onClick={handleSubmit}
								disabled={addCommentMutation.isPending || commentText.trim().length === 0}
								className="h-8 px-3 gap-1.5"
							>
								{addCommentMutation.isPending ? <Spinner className="size-3"/> : <Send className="w-3 h-3"/>}
								<span className="text-xs">Send</span>
							</Button>
						</div>
					</div>
				</div>
			)}

			{displayedComments.length > 0 && (
				<div className="space-y-3">
					{displayedComments.map((comment) => (
							<PostCommentItem
								key={comment.id}
								comment={comment}
								postId={postId}
								currentUserId={user!.id}
								showLikes={showLikes}
								readonly={readonly}
							/>
						)
					)}
					{
						canLoadMore && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleLoadMore}
								disabled={isFetchingNextPage}
								className="w-full text-xs text-gray-500 hover:text-gray-700 h-8"
							>
								{isFetchingNextPage ? (
									<>
										<Spinner className="size-3 mr-1.5"/>
										Loading...
									</>
								) : (
									"Load more post-comments"
								)}
							</Button>
						)
					}
					{
						expanded && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleShowLess}
								className="w-full text-xs text-gray-500 hover:text-gray-700 h-8"
							>
								Show less
							</Button>
						)
					}
				</div>
			)
			}
		</div>
	)
		;
}
