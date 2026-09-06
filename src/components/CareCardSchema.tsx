export function CareCardSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "CareCard",
    "url": "https://care-card-three.vercel.app/",
    "description": "Privacy-first QR emergency contact card and digital assistance system.",
    "applicationCategory": "SafetyApplication",
    "operatingSystem": "Web",
    "isAccessibleForFree": true,
    "image": "https://care-card-three.vercel.app/carecard.svg",
    "publisher": {
      "@type": "Organization",
      "name": "CareCard",
      "url": "https://care-card-three.vercel.app/"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}

export function CareCardOrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CareCard",
    "url": "https://care-card-three.vercel.app/",
    "logo": "https://care-card-three.vercel.app/carecard.svg",
    "sameAs": [
      "https://github.com/Guru-CodesAI/CareCard"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema)
      }}
    />
  );
}
