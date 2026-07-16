import seriesIndex from "../../content/index.json";
import volume1 from "../../content/volume-1.json";
import volume2 from "../../content/volume-2.json";
import type { SeriesIndex, Volume } from "./types";

const volumesBySlug: Record<string, Volume> = {
  rising: volume1 as Volume,
  frequency: volume2 as Volume,
};

export function getSeriesIndex(): SeriesIndex {
  return seriesIndex as SeriesIndex;
}

export function getAllVolumes(): Volume[] {
  return Object.values(volumesBySlug).sort(
    (a, b) => a.volumeNumber - b.volumeNumber,
  );
}

export function getVolumeBySlug(slug: string): Volume | undefined {
  return volumesBySlug[slug];
}

export function getChapter(volumeSlug: string, chapterSlug: string) {
  const volume = getVolumeBySlug(volumeSlug);
  if (!volume) return undefined;
  const chapter = volume.chapters.find((item) => item.slug === chapterSlug);
  if (!chapter) return undefined;
  return { volume, chapter };
}
