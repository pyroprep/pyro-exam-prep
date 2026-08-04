"use client";

type VideoPlayerProps = {
  src: string;
  title?: string;
};

export default function VideoPlayer({ src, title }: VideoPlayerProps) {
  return (
    <div className="rounded-xl border border-zinc-800 w-full aspect-video bg-black">
      <video
        className="h-full w-full rounded-xl"
        controls
        preload="metadata"
        title={title}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}