# Feature: Image Galleries

> Technical documentation for the **Galleries** feature, implemented on 17/02/2026.  
> Reference: [astro-paper issue #553](https://github.com/satnaing/astro-paper/issues/553)

---

## Table of contents

1. [Overview](#overview)
2. [Files involved](#files-involved)
3. [How to create a gallery](#how-to-create-a-gallery)
4. [Frontmatter: available fields](#frontmatter-available-fields)
5. [How images are processed](#how-images-are-processed)
6. [Automatic alt text](#automatic-alt-text)
7. [Cover image (coverImage)](#cover-image-coverimage)
8. [Enable / disable the section](#enable--disable-the-section)
9. [GalleryEmbed — gallery inside MDX posts](#galleryembed--gallery-inside-mdx-posts)
10. [Architecture and data flow](#architecture-and-data-flow)
11. [Lightbox](#lightbox)
12. [Styles and responsive](#styles-and-responsive)
13. [Known limitations](#known-limitations)
14. [Future extensions](#future-extensions)

---

## Overview

The Galleries feature allows publishing image collections accessible at `/galleries`. Each gallery is a **folder** inside `src/data/galleries/` containing:

- An `index.md` (or `index.mdx`) file with the gallery metadata.
- The image files directly in that folder.

Images are processed by the **Astro Assets** pipeline (`astro:assets`) at build time, generating optimized versions with `srcset`, lazy loading, and automatic modern format conversion.

---

## Files involved

| File | Role |
|---|---|
| `src/config.ts` | `showGalleries` flag to enable/disable the section |
| `src/content.config.ts` | `galleries` collection definition with Zod schema |
| `src/components/GalleryCard.astro` | Card used in the listing page |
| `src/components/GalleryEmbed.astro` | Component to embed galleries inside MDX posts |
| `src/components/Header.astro` | Conditional nav link (desktop + mobile) |
| `src/assets/icons/IconGallery.svg` | Grid icon for the header |
| `src/pages/galleries/index.astro` | Listing page `/galleries` |
| `src/pages/galleries/[gallery].astro` | Detail page `/galleries/<slug>` |
| `src/layouts/PostDetails.astro` | Registers `GalleryEmbed` as a global MDX component |
| `src/data/galleries/` | Root directory for gallery content |

---

## How to create a gallery

### Folder structure

```
src/data/galleries/
└── gallery-name/
    ├── index.md          ← required metadata
    ├── 01-first.jpg
    ├── 02-second.jpg
    └── 03-third.png
```

### Naming rules

- The **folder** name becomes the URL slug: `gallery-name` → `/galleries/gallery-name`
- The metadata file must be named **exactly** `index.md` or `index.mdx`.
- Images are displayed **sorted alphabetically** by filename. Using a numeric prefix (`01-`, `02-`, …) is the recommended way to control the order.

---

## Frontmatter: available fields

```yaml
---
title: My Trip to Japan              # required — visible gallery name
description: Travel photos...        # required — shown in the card and <meta description>
pubDatetime: 2026-01-20T00:00:00Z    # required — publication date (ISO 8601)
draft: false                         # optional — if true, not published (default: false)
coverImage: ./01-tokyo.jpg           # optional — explicit cover image (see coverImage section)
tags:                                # optional — array of tags (no #)
  - japan
  - travel
---
```

> **Note:** unlike blog posts, galleries **have no document body**. All visual content comes from the images in the folder.

---

## How images are processed

`import.meta.glob` with `{ eager: true }` is used at build time:

```ts
const allImages = import.meta.glob<{ default: ImageMetadata }>(
  "/src/data/galleries/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP}",
  { eager: true }
);
```

### Why `eager: true`

Astro/Vite requires that globs for images processed by `<Image />` be static and resolved at compile time. With `eager: true`, all modules are imported immediately and Vite generates the metadata (`width`, `height`, optimized `src`) for each image. Without `eager`, `ImageMetadata` would not be available to pass to the `<Image />` component.

### How images are filtered per gallery

In `[gallery].astro`, the global glob is filtered using the URL slug:

```ts
const images = Object.entries(allImages)
  .filter(([path]) =>
    path.startsWith(`/src/data/galleries/${slug}/`) &&
    !path.includes("index")   // excludes index.md/mdx if it falls into the glob
  )
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, mod]) => ({ src: mod.default, alt: filenameToAlt(filename), filename }));
```

### Optimizations applied by Astro

The `<Image />` component with these props:

```astro
<Image
  src={img.src}
  alt={img.alt}
  widths={[400, 800]}
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  loading={idx < 6 ? "eager" : "lazy"}
/>
```

Automatically generates:
- `srcset` with versions at 400 px and 800 px.
- Conversion to a modern format (WebP/AVIF depending on browser support).
- Explicit `width` and `height` to prevent layout shift (CLS).
- Lazy loading for images beyond the 6th (the first ones load `eager` for above-the-fold).

---

## Automatic alt text

When there is no explicit alt metadata, the alt text is derived from the **filename**:

```
01-sunset-in-kyoto.jpg  →  "Sunset In Kyoto"
002_fuji_mountain.png   →  "Fuji Mountain"
IMG_4532.JPG            →  "IMG 4532"  (falls back to gallery title if empty)
```

Responsible function (`filenameToAlt` in `[gallery].astro`):

```ts
function filenameToAlt(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")           // remove extension
    .replace(/^\d+[-_]?/, "")          // remove leading number
    .replace(/[-_]/g, " ")             // hyphens/underscores → spaces
    .replace(/\b\w/g, c => c.toUpperCase()) // capitalize each word
    .trim() || title;                  // fallback to gallery title
}
```

---

## Cover image (coverImage)

There are two ways to define a cover:

### Option A — `coverImage` in frontmatter (recommended)

```yaml
coverImage: ./01-tokyo.jpg
```

- Astro resolves the relative path from `index.md` and optimizes it.
- If that same image already exists in the folder's photo list (`hasCoverInFolder`), it is **not shown twice** as a top banner — it only appears in the grid.
- If the image is **not** in the folder (e.g. a dedicated cover image), it is displayed as a banner at the top of the detail page.

### Option B — No `coverImage`

- The first image (alphabetically) in the folder is used as the cover in **listing cards** (`fallbackImage`).
- On the detail page there is no banner; the grid starts directly.

---

## Enable / disable the section

In `src/config.ts`:

```ts
export const SITE = {
  // ...
  showGalleries: true,  // false → redirects /galleries to 404 and hides the nav link
};
```

Both `src/pages/galleries/index.astro` and `src/pages/galleries/[gallery].astro` check this flag on the server. `getStaticPaths` returns `[]` when `false`, so **no routes are generated in the build**.

---

## GalleryEmbed — gallery inside MDX posts

`GalleryEmbed` is a self-contained Astro component that renders the image grid of any gallery **inside the body of an MDX post**, including its own lightbox.

### Global registration

The component is registered globally in `src/layouts/PostDetails.astro`:

```ts
// PostDetails.astro
import GalleryEmbed from "@/components/GalleryEmbed.astro";
// ...
const { Content } = await render(post, {
  components: { GalleryEmbed },
});
```

Thanks to this, in **any `.mdx` file** you can use it without importing it:

```mdx
<GalleryEmbed slug="gallery-name" />
```

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `slug` | `string` | — | **Required.** Folder name in `src/data/galleries/` |
| `limit` | `number` | `6` | Max images to show. `0` = all |
| `showLink` | `boolean` | `true` | Show footer link to the full gallery |
| `cols` | `2 \| 3 \| 4` | `3` | Number of grid columns |

### Usage examples in MDX

```mdx
{/* Basic usage — first 6 photos, 3 columns */}
<GalleryEmbed slug="my-trip" />

{/* Only 4 photos in 2 columns, no footer link */}
<GalleryEmbed slug="my-trip" limit={4} cols={2} showLink={false} />

{/* Show all photos */}
<GalleryEmbed slug="my-trip" limit={0} />
```

### Behavior with an invalid slug

If `slug` does not match any entry in the `galleries` collection, the component renders a warning message **instead of breaking the build**:

```
⚠️ Gallery my-gallery not found. Make sure src/data/galleries/my-gallery/index.md exists.
```

### Technical details

- Each `GalleryEmbed` creates its own `<dialog>` with ID `ge-lb-{slug}` for the lightbox. This allows **multiple embeds in the same post** without conflicts.
- The initialization script uses `document.querySelectorAll("[data-gallery-embed]")` and re-runs on `astro:after-swap` for View Transitions compatibility.
- Images use the same `widths` and `sizes` as `[gallery].astro`; Astro does not duplicate optimization — if the same photo appears in both the embed and the detail page, it is optimized **only once** during the build.

---

## Architecture and data flow

```
Build time
──────────────────────────────────────────────────────────────────────
src/data/galleries/
  <slug>/
    index.md          ──► "galleries" collection (Astro Content)
    *.jpg / *.png     ──► import.meta.glob eagerly ──► ImageMetadata[]
                                                          │
                                        ┌─────────────────┴──────────────────┐
                                        │                                    │
                              index.astro                          [gallery].astro
                         (listing /galleries)              (detail /galleries/<slug>)
                                        │                                    │
                              GalleryCard.astro                    <Image /> component
                         coverImage or fallbackImage           grid + lightbox client-side
```

---

## Lightbox

The detail page includes a **native lightbox using `<dialog>`** — no external dependencies.

### Behavior

| Action | Result |
|---|---|
| Click on image | Opens the lightbox with that image |
| `←` / `→` | Navigate between images |
| `Esc` | Close the lightbox |
| Click outside the image | Close the lightbox |
| `‹` and `›` buttons | Touch/click navigation |

### Technical details

- The lightbox is a standard `<dialog>` using `showModal()` / `close()`. This blocks background scroll and handles focus accessibly.
- Images in the lightbox use the `src` of the Astro-processed version (the largest in the srcset).
- The script registers on `astro:after-swap` to maintain compatibility with **View Transitions**.
- `document.body.style.overflow = "hidden"` while the lightbox is open to prevent double scrolling in some browsers.

---

## Styles and responsive

### Listing grid (`/galleries`)

| Viewport | Columns |
|---|---|
| `< 640px` | 1 |
| `640px – 1023px` | 2 |
| `≥ 1024px` | 3 |

### Detail grid (`/galleries/<slug>`)

| Viewport | Columns |
|---|---|
| `< 640px` | 2 |
| `640px – 1023px` | 3 |
| `≥ 1024px` | 4 |

Grid and lightbox styles are **scoped** inside `<style>` in `[gallery].astro`. GalleryCard styles are scoped in `GalleryCard.astro`. Hero classes (`.archive-hero`, `.aurora-orb`, `.hero-badge`) come from the global stylesheet (`src/styles/global.css`) and are reused from the Archive page.

---

## Known limitations

1. **Static glob**: `import.meta.glob` requires a literal string at compile time. It is not possible to make the glob dynamic per gallery — that is why a global glob over all galleries is used and then filtered at build runtime.

2. **Uppercase extensions**: the glob includes variants `.JPG`, `.JPEG`, `.PNG`, `.WEBP` to cover photos exported from cameras/phones. If a new format is added (e.g. converted `.HEIC`), it must be manually added to the glob in **both** pages (`index.astro` and `[gallery].astro`).

3. **No pagination on detail page**: if a gallery has many images (>100), all of them are rendered in the HTML. For very large galleries, pagination or infinite scroll would need to be implemented.

4. **Alt text derived from filename**: it is automatic but not perfect. For images with non-descriptive names (e.g. `IMG_4532.jpg`), the resulting alt is generic. This can be improved in the future with an `images` field in the frontmatter (see extensions).

5. **No integration with global tags**: gallery tags do not appear in `/tags`. They are independent of the post tag system.

---

## Future extensions

### A. `images` field in frontmatter for explicit alt text

If full control over alt text or order is needed, add to the schema:

```ts
// in content.config.ts
images: z.array(z.object({
  filename: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
})).optional(),
```

In `[gallery].astro`, merge the frontmatter array with the folder images by `filename`.

### B. Pagination on detail page

Add a `?page=N` parameter and paginate `images.slice(offset, offset + PAGE_SIZE)`. For SEO, use `<link rel="next">` / `<link rel="prev">`.

### C. Integration with global tags

Merge the `galleries` collection with the `blog` collection in `getUniqueTags.ts` so that gallery tags appear in `/tags`.

### D. Lightbox with zoom

Replace the lightbox `<img>` with a library like [PhotoSwipe](https://photoswipe.com/) for pinch-to-zoom support on mobile. PhotoSwipe accepts `ImageMetadata` and does not require bundling extra images.

### E. Cover with video

Add a `coverVideo: z.string().url().optional()` field in the schema for galleries that want an animated cover (URL to a short video). In `GalleryCard.astro`, render a `<video autoplay muted loop>` instead of `<Image>`.

### F. Gallery embedded in a post ✅ **Implemented**

> See the [GalleryEmbed](#galleryembed--gallery-inside-mdx-posts) section for full documentation.