"use client";
import { useLandingContent } from "@/components/landing/LocaleProvider";
import Image from "next/image";

function Avatar({
  id = "seoha",
  className = "",
}: {
  id?: string;
  className?: string;
}) {
  return (
    <Image
      src={`/assets/${id}.webp`}
      alt=""
      width={150}
      height={150}
      className={`feature-avatar ${className}`}
    />
  );
}
function CharactersPreview() {
  return (
    <div className="avatar-group">
      <Avatar id="ian" />
      <Avatar className="main-avatar" />
      <Avatar id="yuri" />
    </div>
  );
}
function MemoryPreview() {
  const { FEATURE_CHAT_PREVIEW } = useLandingContent();
  return (
    <div className="chat-preview">
      <div className="chat-line">
        <Avatar />
        <p>
          {FEATURE_CHAT_PREVIEW.incoming.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
      </div>
      <div className="chat-line outgoing">
        <p>
          {FEATURE_CHAT_PREVIEW.outgoing.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </p>
        <Avatar id="yuri" />
      </div>
    </div>
  );
}
function RecordsPreview() {
  const { FEATURE_RECORD_PREVIEWS } = useLandingContent();
  return (
    <div className="record-preview">
      {FEATURE_RECORD_PREVIEWS.map((record) => (
        <div className="record-row" key={record.id}>
          <Avatar id={record.id} />
          <div>
            <strong>
              {record.role}, {record.name}
            </strong>
            <p>{record.message}</p>
          </div>
          <time>{record.time}</time>
        </div>
      ))}
    </div>
  );
}
function StoryPreview() {
  const { UI } = useLandingContent();
  return (
    <Image
      className="story-art"
      alt={UI.bookAlt}
      width={300}
      height={200}
      src="/assets/story-book-transparent.webp"
    />
  );
}
const previews = [
  CharactersPreview,
  MemoryPreview,
  RecordsPreview,
  StoryPreview,
];
export function FeatureHighlights() {
  const { FEATURE_HIGHLIGHTS, FEATURES_SUBTITLE, FEATURES_TITLE } =
    useLandingContent();
  return (
    <section className="landing-features landing-container" id="features">
      <div className="section-heading">
        <h2>
          {FEATURES_TITLE.split("Petty")[0]}
          <span>Petty</span>
          {FEATURES_TITLE.split("Petty")[1]}
        </h2>
        <p>{FEATURES_SUBTITLE}</p>
      </div>
      <ul className="feature-grid">
        {FEATURE_HIGHLIGHTS.map((feature, i) => {
          const Preview = previews[i];
          return (
            <li className="feature-card" key={feature.id}>
              <h3>{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-visual">
                <Preview />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
