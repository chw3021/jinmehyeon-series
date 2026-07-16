import { notFound } from "next/navigation";
import PageFlipReader from "@/components/PageFlipReader";
import { getAllVolumes, getChapter } from "@/lib/content";

type Props = {
  params: Promise<{ volume: string; chapter: string }>;
};

export function generateStaticParams() {
  return getAllVolumes().flatMap((volume) =>
    volume.chapters.map((chapter) => ({
      volume: volume.slug,
      chapter: chapter.slug,
    })),
  );
}

export default async function ChapterReaderPage({ params }: Props) {
  const { volume: volumeSlug, chapter: chapterSlug } = await params;
  const result = getChapter(volumeSlug, chapterSlug);
  if (!result) notFound();

  return <PageFlipReader volume={result.volume} chapter={result.chapter} />;
}
