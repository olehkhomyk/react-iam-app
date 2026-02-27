import type { Post } from '@/features/posts/model/Post';
import { CompactPostCard } from './compact-post-card';
import { FullPostCard } from './full-post-card';

interface PostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  showActions?: boolean;
  variant?: 'default' | 'compact';
}

export function PostCard({ 
  post, 
  onLike, 
  onComment, 
  onShare,
  variant = 'default'
}: PostCardProps) {
  if (variant === 'compact') {
    return (
      <CompactPostCard
        post={post}
        onLike={onLike}
        onComment={onComment}
      />
    );
  }

  return (
    <FullPostCard
      post={post}
      onLike={onLike}
      onComment={onComment}
      onShare={onShare}
    />
  );
}
