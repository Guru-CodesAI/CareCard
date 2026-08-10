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

    const canonicalUrl = `${SITE_URL}${path}`;

    setMeta("description", description);
    setMeta(
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large"
    );

    setMetaProperty("og:title", title);
    setMetaProperty("og:description", description);
    setMetaProperty("og:url", canonicalUrl);
    setMetaProperty("og:image", image.startsWith("http") ? image : `${SITE_URL}${image}`);

    setMeta("twitter:title", title);
    setMeta("twitter:description", description);
    setMeta("twitter:image", image.startsWith("http") ? image : `${SITE_URL}${image}`);

    let canonical = document.querySelector(
      'link[rel="canonical"]'
    ) as HTMLLinkElement | null;

    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }

    canonical.href = canonicalUrl;

    return () => {
      // Keep metadata stable or reset as needed
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
