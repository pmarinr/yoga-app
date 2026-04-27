interface Props {
  youtubeId: string
  title?: string
}

export function VideoEmbed({ youtubeId, title }: Props) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={title ?? 'YouTube video'}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}
