import { useState, useRef } from "react";
import { ImagePlus, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PostUpdateForm } from "./PostUpdateForm.tsx";
import { ImageZoom } from "@/shared/ui/image-zoom/ImageZoom.tsx";
import type { PostTypes } from "@/features/posts/model/post.types.ts";

interface UpdatePostDialogProps {
  post: PostTypes;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: (postId: number, values: { title: string; content: string; image?: File }) => any;
}

export function PostUpdateDialog({ post, open, onOpenChange, onUpdate }: UpdatePostDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveNewImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleClose = (open: boolean) => {
    if (!open) handleRemoveNewImage();
    onOpenChange(open);
  };

  const handleSubmit = async (values: { title: string; content: string }) => {
    try {
      setIsLoading(true);
      await onUpdate?.(post.id, { ...values, image: image ?? undefined });
      handleRemoveNewImage();
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="!max-w-3xl !w-[90vw] !h-auto max-h-[90vh] p-0 flex flex-col gap-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl">Edit Post</DialogTitle>
          <DialogDescription>Make changes to your post. Click save when you're done.</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-6 min-h-0 space-y-6">
          <PostUpdateForm
            post={post}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            renderInDialog={true}
            formRef={formRef}
          />

          <Separator />

          <div className="space-y-3">
            <p className="text-base font-semibold">Post Image</p>

            {previewUrl ? (
              <div className="relative w-full rounded-lg overflow-hidden border bg-muted max-h-96 flex items-center justify-center">
                <img src={previewUrl} alt="Preview" className="w-auto h-full max-h-96 object-contain" />
                <button
                  type="button"
                  onClick={handleRemoveNewImage}
                  disabled={isLoading}
                  className="absolute top-2 right-2 inline-flex h-7 w-7 items-center justify-center rounded-md bg-black/60 text-white hover:bg-black/80 transition-colors"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : post.imageKey ? (
              <div className="w-full space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 py-2.5 text-sm font-medium text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  <ImagePlus className="h-4 w-4" />
                  Replace Image
                </button>
                <div className="w-full rounded-lg overflow-hidden border bg-muted max-h-96 flex items-center justify-center">
                  <ImageZoom
                    imageKey={post.imageKey}
                    alt={post.title}
                    trigger="icon"
                    className="w-auto h-full max-h-96 object-contain"
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/30 py-10 text-muted-foreground hover:border-muted-foreground/60 hover:text-foreground transition-colors"
              >
                <ImagePlus className="h-8 w-8" />
                <span className="text-sm">Click to upload an image</span>
                <span className="text-xs">PNG, JPG, WEBP up to 10 MB</span>
              </button>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </div>
        </div>

        <Separator className="shrink-0" />

        <div className="flex justify-between px-6 py-4 shrink-0">
          <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="button" disabled={isLoading} onClick={() => formRef.current?.requestSubmit()}>
            {isLoading ? (
              <>
                <span className="mr-2">Saving...</span>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
