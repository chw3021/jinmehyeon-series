import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllVolumes, getVolumeBySlug } from "@/lib/content";

type Props = {
  params: Promise<{ volume: string }>;
};

export function generateStaticParams() {
  return getAllVolumes().map((volume) => ({ volume: volume.slug }));
}

export default async function VolumePage({ params }: Props) {
  const { volume: volumeSlug } = await params;
  const volume = getVolumeBySlug(volumeSlug);
  if (!volume) notFound();

  return (
    <div className="volume-shell">
      <Link href="/" className="brand-mini" style={{ display: "inline-block", marginBottom: "1.5rem" }}>
        ← 진메현 시리즈
      </Link>
      <p className="eyebrow" style={{ color: "var(--ember)", letterSpacing: "0.08em" }}>
        {volume.volumeNumber}편
      </p>
      <h1 className="brand" style={{ fontSize: "clamp(2.4rem, 7vw, 4.2rem)", maxWidth: "12ch" }}>
        {volume.title}
      </h1>
      <p className="hero-copy">{volume.synopsis}</p>

      <section className="section">
        <h2>장 목록</h2>
        <div className="chapter-grid">
          {volume.chapters.map((chapter) => (
            <Link
              key={chapter.slug}
              href={`/volumes/${volume.slug}/${chapter.slug}/`}
              className="chapter-link"
            >
              <span>{chapter.title}</span>
              <span aria-hidden>→</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
