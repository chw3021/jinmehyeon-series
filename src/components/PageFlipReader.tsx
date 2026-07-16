"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Chapter, Volume } from "@/lib/types";
import { paginateParagraphs } from "@/lib/paginate";
import { withBasePath } from "@/lib/paths";

type Props = {
  volume: Volume;
  chapter: Chapter;
};

export default function PageFlipReader({ volume, chapter }: Props) {
  const pages = useMemo(
    () => paginateParagraphs(chapter.paragraphs),
    [chapter.paragraphs],
  );
  const [pageIndex, setPageIndex] = useState(0);
  const [flipDir, setFlipDir] = useState<"next" | "prev" | null>(null);
  const [navOpen, setNavOpen] = useState(false);

  const chapterIndex = volume.chapters.findIndex((c) => c.slug === chapter.slug);
  const prevChapter = chapterIndex > 0 ? volume.chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < volume.chapters.length - 1
      ? volume.chapters[chapterIndex + 1]
      : null;

  const goNext = useCallback(() => {
    if (pageIndex < pages.length - 1) {
      setFlipDir("next");
      setPageIndex((v) => v + 1);
      return;
    }
    if (nextChapter) {
      window.location.href = withBasePath(
        `/volumes/${volume.slug}/${nextChapter.slug}/`,
      );
    }
  }, [pageIndex, pages.length, nextChapter, volume.slug]);

  const goPrev = useCallback(() => {
    if (pageIndex > 0) {
      setFlipDir("prev");
      setPageIndex((v) => v - 1);
      return;
    }
    if (prevChapter) {
      window.location.href = withBasePath(
        `/volumes/${volume.slug}/${prevChapter.slug}/`,
      );
    }
  }, [pageIndex, prevChapter, volume.slug]);

  useEffect(() => {
    setPageIndex(0);
    setFlipDir(null);
  }, [chapter.slug]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault();
        goNext();
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault();
        goPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev]);

  useEffect(() => {
    if (!flipDir) return;
    const timer = window.setTimeout(() => setFlipDir(null), 420);
    return () => window.clearTimeout(timer);
  }, [pageIndex, flipDir]);

  const currentPage = pages[pageIndex] ?? [];

  return (
    <div className="reader-shell">
      <header className="reader-top">
        <Link href="/" className="brand-mini">
          진메현 시리즈
        </Link>
        <div className="reader-top-meta">
          <span>{volume.title}</span>
          <span className="dot" aria-hidden>
            ·
          </span>
          <span>{chapter.title}</span>
        </div>
        <button
          type="button"
          className="nav-toggle"
          onClick={() => setNavOpen((v) => !v)}
          aria-expanded={navOpen}
        >
          목차
        </button>
      </header>

      <aside className={`chapter-drawer ${navOpen ? "open" : ""}`}>
        <div className="drawer-head">
          <h2>편 · 장 선택</h2>
          <button type="button" onClick={() => setNavOpen(false)}>
            닫기
          </button>
        </div>
        <div className="drawer-section">
          <p className="drawer-label">편</p>
          <Link
            href={`/volumes/${volume.slug}/`}
            className="volume-chip active"
            onClick={() => setNavOpen(false)}
          >
            {volume.volumeNumber}편. {volume.title}
          </Link>
        </div>
        <div className="drawer-section">
          <p className="drawer-label">장</p>
          <div className="chapter-list">
            {volume.chapters.map((item) => (
              <Link
                key={item.slug}
                href={`/volumes/${volume.slug}/${item.slug}/`}
                className={`chapter-btn ${item.slug === chapter.slug ? "active" : ""}`}
                onClick={() => setNavOpen(false)}
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </aside>
      {navOpen ? (
        <button
          type="button"
          className="drawer-backdrop"
          aria-label="목차 닫기"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <main className="reader-stage">
        <button
          type="button"
          className="edge-hit left"
          onClick={goPrev}
          aria-label="이전 페이지"
        />
        <article
          key={`${chapter.slug}-${pageIndex}`}
          className={`book-page ${flipDir === "next" ? "flip-next" : ""} ${flipDir === "prev" ? "flip-prev" : ""}`}
        >
          <div className="page-glow" aria-hidden />
          <h1 className="page-title">{chapter.title}</h1>
          <div className="page-body">
            {currentPage.map((paragraph, index) => (
              <p key={`${pageIndex}-${index}`}>
                {paragraph.split("\n").map((line, lineIndex, arr) => (
                  <span key={`${index}-${lineIndex}`}>
                    {line.trim()}
                    {lineIndex < arr.length - 1 ? <br /> : null}
                  </span>
                ))}
              </p>
            ))}
          </div>
          <footer className="page-footer">
            <span>
              {pageIndex + 1} / {pages.length}
            </span>
          </footer>
        </article>
        <button
          type="button"
          className="edge-hit right"
          onClick={goNext}
          aria-label="다음 페이지"
        />
      </main>

      <footer className="reader-controls">
        <button type="button" onClick={goPrev} disabled={pageIndex === 0 && !prevChapter}>
          이전
        </button>
        <div className="page-dots" aria-hidden>
          {pages.map((_, index) => (
            <button
              key={index}
              type="button"
              className={`dot-btn ${index === pageIndex ? "active" : ""}`}
              onClick={() => {
                setFlipDir(index > pageIndex ? "next" : "prev");
                setPageIndex(index);
              }}
              aria-label={`${index + 1}페이지`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={goNext}
          disabled={pageIndex >= pages.length - 1 && !nextChapter}
        >
          다음
        </button>
      </footer>
    </div>
  );
}
