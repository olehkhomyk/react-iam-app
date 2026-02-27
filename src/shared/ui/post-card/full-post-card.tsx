import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, MoreVertical, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Post } from '@/features/posts/model/Post';
import { getInitials, formatDate } from './utils';
import { ImageZoom } from '@/shared/ui/image-zoom/ImageZoom';

interface FullPostCardProps {
  post: Post;
  onLike?: (postId: number) => void;
  onComment?: (postId: number) => void;
  onShare?: (postId: number) => void;
  onEdit?: (post: Post) => void;
}

export function FullPostCard({ post, onLike, onComment, onShare, onEdit }: FullPostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike?.(post.id);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5">
        {/* Compact Image with Zoom */}
        <div className="relative flex-shrink-0 w-full sm:w-auto">
          <div className="h-[140px] w-full sm:w-[200px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
            <ImageZoom
              src={`https://picsum.photos/seed/${post.id}/400/280.jpg`}
              zoomedSrc={`https://picsum.photos/seed/${post.id}/1200/800.jpg`}
              alt={post.title}
              trigger="icon"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>

        {/* Post Content */}
        <div className="flex-1 min-w-0">
          {/* Header with Avatar */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <Avatar className="ring-2 ring-white shadow-sm h-10 w-10">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.createdBy}`} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-xs">
                  {getInitials(post.createdBy)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-900">{post.createdBy}</p>
                <p className="text-xs text-gray-500">{formatDate(post.created)}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-gray-600 h-8 w-8 p-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => onEdit?.(post)}
                  className="cursor-pointer"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Title and Content */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
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
    </div>
  );
}
