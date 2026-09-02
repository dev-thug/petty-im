import { FEATURE_HIGHLIGHTS } from "@/content/landing-content";

export function FeatureHighlights() {
  return (
    <section className="mx-auto w-full max-w-5xl px-page py-16">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {FEATURE_HIGHLIGHTS.map((feature) => (
          <li
            className="flex flex-col gap-2 rounded-card border border-border bg-card p-6"
            key={feature.id}
          >
            <h2 className="text-title text-foreground">{feature.title}</h2>
            <p className="text-body-sm text-text-secondary">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
