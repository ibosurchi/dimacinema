/**
 * DIMA Cinema - Streaming Provider Registry & Link Normalizer
 * Provides secure embed extraction, normalization, and allowlist validation.
 */

export interface ProviderDefinition {
  id: string;
  name: string;
  nameKurdish: string;
  hostnames: string[];
  sandbox?: string;
  allow?: string;
  transformUrl: (rawUrl: string) => string | null;
}

export const PROVIDER_REGISTRY: Record<string, ProviderDefinition> = {
  gdrive: {
    id: "gdrive",
    name: "Google Drive",
    nameKurdish: "گووگڵ درایڤ",
    hostnames: ["drive.google.com", "docs.google.com"],
    allow: "autoplay; fullscreen; picture-in-picture; encrypted-media",
    transformUrl: (url: string) => {
      // Matches /file/d/{id}/view, /file/d/{id}/preview, /file/d/{id} or id={id}
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      return url.includes("/preview") ? url : null;
    },
  },
  vidmoly: {
    id: "vidmoly",
    name: "Vidmoly",
    nameKurdish: "ڤیدمۆلی",
    hostnames: [
      "vidmoly.to",
      "vidmoly.me",
      "vidmoly.net",
      "vidmoly.biz",
      "vidmoly.cam",
      "vidmoly.io",
      "vidmoly.in",
    ],
    // Video streaming hosts like Vidmoly block playback if strict sandbox is applied
    allow: "autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write",
    transformUrl: (url: string) => {
      try {
        const parsed = new URL(url);
        const host = parsed.hostname; // Preserves exact domain (vidmoly.net / vidmoly.to / etc.)
        const cleanPath = parsed.pathname.replace(/\/+$/, "");
        const match = cleanPath.match(/(?:w\/|embed-|d\/)?([a-zA-Z0-9_-]+?)(?:\.html)?$/);
        if (match && match[1]) {
          return `https://${host}/embed-${match[1]}.html`;
        }
      } catch {}
      return url;
    },
  },
  sharevids: {
    id: "sharevids",
    name: "Sharevids",
    nameKurdish: "شەیرڤیدز",
    hostnames: ["sharevids.com", "sharevids.net", "sharevids.co"],
    allow: "autoplay; fullscreen; picture-in-picture; encrypted-media",
    transformUrl: (url: string) => {
      const match = url.match(/sharevids\.[a-z]+\/(?:embed\/|v\/)?([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://sharevids.com/embed/${match[1]}`;
      }
      return url;
    },
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    nameKurdish: "یوتیوب",
    hostnames: ["youtube.com", "www.youtube.com", "youtu.be", "m.youtube.com"],
    allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen",
    transformUrl: (url: string) => {
      const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (shortMatch && shortMatch[1]) {
        return `https://www.youtube.com/embed/${shortMatch[1]}?rel=0&modestbranding=1`;
      }
      const vMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (vMatch && vMatch[1]) {
        return `https://www.youtube.com/embed/${vMatch[1]}?rel=0&modestbranding=1`;
      }
      const embedMatch = url.match(/\/embed\/([a-zA-Z0-9_-]+)/);
      if (embedMatch && embedMatch[1]) {
        return `https://www.youtube.com/embed/${embedMatch[1]}?rel=0&modestbranding=1`;
      }
      return url;
    },
  },
  vimeo: {
    id: "vimeo",
    name: "Vimeo",
    nameKurdish: "ڤیمیۆ",
    hostnames: ["vimeo.com", "player.vimeo.com"],
    allow: "autoplay; fullscreen; picture-in-picture; encrypted-media",
    transformUrl: (url: string) => {
      const match = url.match(/vimeo\.com\/(?:video\/)?([0-9]+)/);
      if (match && match[1]) {
        return `https://player.vimeo.com/video/${match[1]}`;
      }
      return url;
    },
  },
  custom: {
    id: "custom",
    name: "Custom Embed",
    nameKurdish: "سێرڤەری تایبەت",
    hostnames: ["*"], // fallback for admin custom secure URLs
    allow: "autoplay; fullscreen; picture-in-picture; encrypted-media",
    transformUrl: (url: string) => url,
  },
};

/**
 * Extracts iframe src if user pasted a complete HTML iframe code
 */
export function extractIframeSrc(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith("<iframe") || trimmed.includes("<iframe")) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  return trimmed;
}

/**
 * Detect provider from URL
 */
export function detectProvider(rawUrl: string): ProviderDefinition {
  const cleanUrl = extractIframeSrc(rawUrl);
  try {
    const parsed = new URL(cleanUrl);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");

    for (const key of Object.keys(PROVIDER_REGISTRY)) {
      const prov = PROVIDER_REGISTRY[key];
      if (prov.hostnames.some((h) => host === h || host.endsWith("." + h))) {
        return prov;
      }
    }
  } catch {
    // If not valid URL yet
  }
  return PROVIDER_REGISTRY.custom;
}

/**
 * Normalize pasted stream link to clean embed URL
 */
export function normalizeStreamUrl(input: string): {
  success: boolean;
  provider: string;
  embedUrl: string;
  error?: string;
} {
  const extracted = extractIframeSrc(input);
  if (!extracted) {
    return { success: false, provider: "custom", embedUrl: "", error: "بەستەر بەتاڵە" };
  }

  // Ensure starts with http:// or https://
  let normalized = extracted;
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = "https://" + normalized;
  }

  try {
    new URL(normalized); // validate URL syntax
  } catch {
    return { success: false, provider: "custom", embedUrl: "", error: "فۆرماتی بەستەر هەڵەیە" };
  }

  const provider = detectProvider(normalized);
  const transformed = provider.transformUrl(normalized);

  if (!transformed) {
    return {
      success: false,
      provider: provider.id,
      embedUrl: "",
      error: "نەتوانرا بەستەری پەخش دەربهێنرێت لەم بەستەرە",
    };
  }

  return {
    success: true,
    provider: provider.id,
    embedUrl: transformed,
  };
}

/**
 * Get Content Security Policy frame-src directive from allowed hostnames
 */
export function getFrameSrcCSP(): string {
  const hosts = new Set<string>();
  Object.values(PROVIDER_REGISTRY).forEach((p) => {
    p.hostnames.forEach((h) => {
      if (h !== "*") {
        hosts.add(`https://${h}`);
        hosts.add(`https://*.${h}`);
      }
    });
  });
  return Array.from(hosts).join(" ");
}
