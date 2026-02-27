import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle } from 'lucide-react';
import type { Post } from '@/features/posts/model/Post';
import { getInitials, formatDate } from './utils';

interface CompactPostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
}

export function CompactPostCard({ post, onLike, onComment }: CompactPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-3">
        <Avatar size="sm" className="mt-1">
          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.createdBy}`} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
            {getInitials(post.createdBy)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">{post.createdBy}</p>
            <span className="text-xs text-gray-500">{formatDate(post.created)}</span>
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.title}
          </h3>
          <p className="text-xs text-gray-600" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.content}
          </p>
          <div className="flex items-center space-x-3 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`h-6 px-2 text-xs ${isLiked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-gray-600'}`}
            >
              <Heart className={`w-3 h-3 mr-1 ${isLiked ? 'fill-current' : ''}`} />
              {likeCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-600"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
