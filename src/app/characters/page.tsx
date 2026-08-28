import Link from "next/link";
import { getCharacterIndex } from "@/lib/content";
import { withBasePath } from "@/lib/paths";

export default function CharactersPage() {
  const index = getCharacterIndex();

  return (
    <div className="volume-shell">
      <Link href="/" className="brand-mini" style={{ display: "inline-block", marginBottom: "1.5rem" }}>
        ← 진메현 시리즈
      </Link>
      <p className="eyebrow" style={{ color: "var(--ember)", letterSpacing: "0.08em" }}>
        CAST
      </p>
      <h1 className="brand" style={{ fontSize: "clamp(2.4rem, 7vw, 4.2rem)", maxWidth: "12ch" }}>
        {index.title}
      </h1>
      <p className="hero-copy">{index.subtitle}</p>

      <section className="section">
        <div className="character-grid">
          {index.characters.map((character) => (
            <article key={character.slug} className="character-card">
              <div className="character-photo-wrap">
                <img
                  src={withBasePath(character.image)}
                  alt={`${character.name} (${character.codename})`}
                  className="character-photo"
                  loading="lazy"
                />
              </div>
              <div className="character-body">
                <span className="eyebrow">{character.role}</span>
                <h2>{character.name}</h2>
                <p className="character-codename">코드명 · {character.codename}</p>
                <p className="character-description">{character.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
