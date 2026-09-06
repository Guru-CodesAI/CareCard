import { useEffect } from "react";

const SITE_URL = "https://care-card-three.vercel.app";

interface SEOProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
  image?: string;
}

export function SEO({
  title,
  description,
  path,
  noindex = false,
  image = "/og-image.png",
}: SEOProps) {
  useEffect(() => {
    document.title = title;

    const canonicalUrl = new URL(path, SITE_URL).toString();
    const imageUrl = image.startsWith("http")
      ? image
      : new URL(image, SITE_URL).toString();

    setMeta("description", description);
    setMeta(
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large"
    );

    setMetaProperty("og:type", "website");
    setMetaProperty("og:site_name", "CareCard");
    setMetaProperty("og:locale", "en_US");
    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:url", canonicalUrl);
    setMetaProperty("og:image", imageUrl);
    setMetaProperty("og:image:alt", `${title} - CareCard`);

    setMeta("twitter:card", "summary");
    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:url", canonicalUrl);
    setMeta("twitter:image", imageUrl);
    setMeta("twitter:image:alt", `${title} - CareCard`);

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;

    const schemaId = "carecard-page-schema";
    let schema = document.getElementById(schemaId) as HTMLScriptElement | null;

    if (!noindex) {
      if (!schema) {
        schema = document.createElement("script");
        schema.id = schemaId;
        schema.type = "application/ld+json";
        document.head.appendChild(schema);
      }

      schema.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: title,
        description,
        url: canonicalUrl,
        isPartOf: {
          "@type": "WebSite",
          name: "CareCard",
          url: SITE_URL,
        },
      });
    } else {
      schema?.remove();
    }

    return () => {
      schema?.remove();
    };
  }, [title, description, path, noindex, image]);

  return null;
}

function setMeta(name: string, content: string) {
  let meta = document.querySelector(
    `meta[name="${name}"]`
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = name;
    document.head.appendChild(meta);
  }

  meta.content = content;
}

function setMetaProperty(property: string, content: string) {
  let meta = document.querySelector(
    `meta[property="${property}"]`
  ) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("property", property);
    document.head.appendChild(meta);
  }

  meta.content = content;
}
