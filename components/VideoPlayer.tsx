"use client";

type VideoPlayerProps = {
  src: string;
  title?: string;
};

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  return (
    <div className="rounded-xl border border-zinc-800 w-full aspect-video bg-black">
      {title && (
        <p className="px-4 pt-3 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
          {title}
        </p>
      )}
      <video
        className="h-full w-full rounded-xl border border-zinc-800"
        controls
        playsInline
        preload="auto"
        title={title}
        aria-label={title ?? "Video player"}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
