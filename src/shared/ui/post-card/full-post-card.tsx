import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import type { Post } from '@/features/posts/model/Post';
import { getInitials, formatDate } from './utils';

interface FullPostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
}

export function FullPostCard({ post, onLike, onComment, onShare }: FullPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Post Image Placeholder */}
      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
        <img 
          src={`https://picsum.photos/seed/${post.id}/800/400.jpg`}
          alt={post.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
      </div>

      {/* Post Content */}
      <div className="p-4 sm:p-5">
        {/* Header with Avatar */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="ring-2 ring-white shadow-sm">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.createdBy}`} />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {getInitials(post.createdBy)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-900">{post.createdBy}</p>
              <p className="text-xs text-gray-500">{formatDate(post.created)}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </Button>
        </div>

        {/* Title and Content */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.title}
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.content}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <Button
              variant={isLiked ? "default" : "ghost"}
              size="sm"
              onClick={handleLike}
              className={`h-9 px-3 ${isLiked ? 'bg-red-50 text-red-600 hover:bg-red-100 border-red-200' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-sm font-medium">{likeCount}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onComment?.(post.id)}
              className="h-9 px-3 text-gray-600 hover:text-gray-900"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Reply</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare?.(post.id)}
              className="h-9 px-3 text-gray-600 hover:text-gray-900"
            >
              <Share2 className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
