# VOIDANCE — Event Images & Videos

Drop your event photos and video files into this folder.
They are served as static assets at `/images/events/your-file.jpg`.

---

## Supported Formats

| Type   | Formats                    |
|--------|----------------------------|
| Images | .jpg, .jpeg, .png, .webp   |
| Videos | YouTube embed URL (recommended), .mp4 |

---

## Naming Convention

Use lowercase with hyphens. Include the event/date for easy sorting.

Examples:
  gig-cebu-2026-01.jpg
  gig-cebu-2026-02.jpg
  soundcheck-2026.jpg
  live-at-venue-2026.jpg

---

## How to Add to the Carousel

1. Drop your image here (e.g. `gig-cebu-2026-01.jpg`)
2. Open `src/data/bandData.js`
3. Find the `GALLERY` array and add a new entry:

### For a local image:
```js
{
  type: 'image',
  src:     '/images/events/gig-cebu-2026-01.jpg',
  thumb:   '/images/events/gig-cebu-2026-01.jpg',
  caption: 'Live at Cebu — January 2026',
  event:   'Cebu Underground Fest',
},
```

### For a YouTube video:
```js
{
  type:    'video',
  videoId: 'dQw4w9WgXcQ',   // the part after ?v= in the YouTube URL
  caption: 'Live at Cebu — Official Recording',
  event:   'Cebu Underground Fest',
},
```

### For a placeholder (coming soon):
```js
{
  type:    'placeholder',
  caption: 'Photos coming soon...',
  event:   '',
},
```
