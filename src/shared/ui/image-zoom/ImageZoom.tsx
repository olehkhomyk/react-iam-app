import { useState } from "react";
import { Maximize2, X } from "lucide-react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export type ImageZoomProps = {
  src: string;
  alt?: string;
  className?: string;
  zoomedSrc?: string;
  trigger?: "image" | "icon";
  triggerClassName?: string;
};

export function ImageZoom({
  src,
  alt,
  className,
  zoomedSrc,
  trigger = "image",
  triggerClassName,
}: ImageZoomProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <Dialog>
      {trigger === "image" ? (
        <DialogTrigger asChild>
          <img
            src={src}
            alt={alt}
            className={className}
          />
        </DialogTrigger>
      ) : (
        <div className="relative inline-block w-full h-full">
          <img src={src} alt={alt} className={className} />
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

        <div className="flex items-center justify-center h-full w-full">
          <img
            src={zoomedSrc ?? src}
            alt={alt}
            className={
              "max-w-full max-h-full object-contain transition-all duration-300 ease-in-out " +
              (loaded ? "scale-100 opacity-100" : "scale-95 opacity-0")
            }
            onLoad={() => setLoaded(true)}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
