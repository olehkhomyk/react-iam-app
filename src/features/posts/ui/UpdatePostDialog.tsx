import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { UpdatePostForm } from "./UpdatePostForm";
import type { Post } from "@/features/posts/model/Post";

interface UpdatePostDialogProps {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (postId: number, values: { title: string; content: string }) => void | Promise<void>;
}

export function UpdatePostDialog({
  post,
  open,
  onOpenChange,
  onUpdate,
}: UpdatePostDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  const handleSubmit = async (values: { title: string; content: string }) => {
    try {
      setIsLoading(true);
      await onUpdate?.(post.id, values);
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-3xl !w-[90vw] !h-auto max-h-[90vh] p-0 flex flex-col gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl">Edit Post</DialogTitle>
          <DialogDescription>
            Make changes to your post. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0">
          <UpdatePostForm
            post={post}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            renderInDialog={true}
            formRef={formRef}
          />
        </div>

        <Separator className="shrink-0" />
        
        <div className="flex justify-between px-6 py-4 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isLoading}
            onClick={() => formRef.current?.requestSubmit()}
          >
            {isLoading ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              "Update Post"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
