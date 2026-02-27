import type { Post } from '@/features/posts/model/Post';
import type { PostAction } from './types';
import { FullPostCard } from './full-post-card';

interface PostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  actions?: PostAction[];
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

export function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare,
  actions
}: PostCardProps) {
  return (
    <FullPostCard
      post={post}
      onLike={onLike}
      onComment={onComment}
      onShare={onShare}
      actions={actions}
    />
  );
}
