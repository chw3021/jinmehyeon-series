export type Chapter = {
  id: number;
  slug: string;
  title: string;
  paragraphs: string[];
};

export type Volume = {
  id: string;
  slug: string;
  title: string;
  volumeNumber: number;
  subtitle: string;
  synopsis: string;
  chapters: Chapter[];
};

export type VolumeSummary = {
  id: string;
  slug: string;
  title: string;
  volumeNumber: number;
  status: "complete" | "upcoming" | "draft";
  file: string;
};

export type SeriesIndex = {
  seriesTitle: string;
  seriesTagline: string;
  volumes: VolumeSummary[];
};
