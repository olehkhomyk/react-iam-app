import { useState } from "react";
import { Maximize2, X, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { fetchFileBlob } from "@/shared/api/files.api.ts";

export type ImageZoomProps = {
  imageKey: string;
  alt?: string;
  className?: string;
  trigger?: "image" | "icon";
  triggerClassName?: string;
};

export function ImageZoom({
  imageKey,
  alt,
  className,
  trigger = "image",
  triggerClassName,
}: ImageZoomProps) {
  const [loaded, setLoaded] = useState(false);

  const { data: blobUrl, isLoading } = useQuery({
    queryKey: ["files", imageKey],
    queryFn: () => fetchFileBlob(imageKey),
    staleTime: 5 * 60 * 1000,
    enabled: !!imageKey,
  });


  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[140px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!blobUrl) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[140px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
        <span className="text-xs text-muted-foreground">No image</span>
      </div>
    );
  }

  return (
    <Dialog>
      {trigger === "image" ? (
        <DialogTrigger asChild>
          <img src={blobUrl} alt={alt} className={className} />
        </DialogTrigger>
      ) : (
        <div className="relative flex items-center justify-center w-full">
          <img src={blobUrl} alt={alt} className={className} />
          <DialogTrigger asChild>
            <button
              type="button"
              aria-label="Zoom image"
              className={
                triggerClassName ??
                "absolute top-2 right-2 inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/90 shadow-sm hover:bg-white transition-colors z-10"
              }
            >
              <Maximize2 className="h-4 w-4 text-gray-700" />
            </button>
          </DialogTrigger>
        </div>
      )}

      <DialogContent className="!w-[80vw] !h-[80vh] !max-w-[80vw] p-0 border-0 bg-black/90" showCloseButton={false}>
        <DialogTitle className="sr-only">Image preview</DialogTitle>

        <DialogClose asChild>
          <button className="absolute top-4 right-4 z-50 text-white/90 hover:text-white transition-colors">
            <X className="h-6 w-6" />
          </button>
        </DialogClose>

        <div className="flex items-center justify-center h-full w-full pt-12 pb-4 px-4">
          <img
            src={blobUrl}
            alt={alt}
            className={
              "max-w-full max-h-[calc(80vh-4rem)] object-contain transition-all duration-300 ease-in-out " +
              (loaded ? "scale-100 opacity-100" : "scale-95 opacity-0")
            }
            onLoad={() => setLoaded(true)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
