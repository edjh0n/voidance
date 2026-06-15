import { useSanityQuery, QUERIES } from '../hooks/useSanity'

export default function AnnouncementBanner({ onNavigate }) {
  const { data: announcement } = useSanityQuery(QUERIES.siteAnnouncement, null, { fresh: true })
  if (!announcement?.title) return null

  const hasCta = announcement.ctaLabel && (announcement.ctaPage || announcement.ctaUrl)

  const handleCta = () => {
    if (announcement.ctaType === 'url' && announcement.ctaUrl) {
      window.open(announcement.ctaUrl, '_blank', 'noopener,noreferrer')
      return
    }
    if (announcement.ctaPage) {
      onNavigate(announcement.ctaPage)
    }
  }

  return (
    <div className={`announcement-banner announcement-banner--${announcement.tone || 'default'}`}>
      <div className="announcement-banner__text">
        <strong>{announcement.title}</strong>
        {announcement.message && <span>{announcement.message}</span>}
      </div>
      {hasCta && (
        <button type="button" onClick={handleCta}>
          {announcement.ctaLabel}
        </button>
      )}
    </div>
  )
}
