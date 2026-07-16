import Link from "next/link";
import { getSeriesIndex, getVolumeBySlug } from "@/lib/content";

export default function HomePage() {
  const series = getSeriesIndex();
  const first = series.volumes[0];
  const firstVolume = first ? getVolumeBySlug(first.slug) : undefined;
  const firstChapter = firstVolume?.chapters[0];

  return (
    <div className="home-shell">
      <section className="hero">
        <p className="eyebrow" style={{ color: "var(--ember)", letterSpacing: "0.12em" }}>
          ORIGINAL WEB NOVEL
        </p>
        <h1 className="brand">{series.seriesTitle}</h1>
        <p className="hero-copy">{series.seriesTagline}</p>
        <div className="hero-actions">
          {first && firstChapter ? (
            <Link
              className="btn-primary"
              href={`/volumes/${first.slug}/${firstChapter.slug}/`}
            >
              1편 바로 읽기
            </Link>
          ) : null}
          <Link className="btn-ghost" href="#volumes">
            편 목록 보기
          </Link>
        </div>
      </section>

      <section id="volumes" className="section">
        <h2>편 목록</h2>
        <div className="volume-grid">
          {series.volumes.map((volume) => {
            const detail = getVolumeBySlug(volume.slug);
            return (
              <article key={volume.slug} className="volume-card">
                <span className="eyebrow">{volume.volumeNumber}편 · {volume.status === "complete" ? "완결" : "연재 예정"}</span>
                <h3>{volume.title}</h3>
                <p>{detail?.synopsis ?? "곧 공개됩니다."}</p>
                <div className="hero-actions">
                  <Link className="btn-primary" href={`/volumes/${volume.slug}/`}>
                    장 선택하기
                  </Link>
                  {detail?.chapters[0] ? (
                    <Link
                      className="btn-ghost"
                      href={`/volumes/${volume.slug}/${detail.chapters[0].slug}/`}
                    >
                      첫 장 열기
                    </Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
