import { useEffect, useState } from 'react'
import { useSanityQuery, QUERIES } from '../hooks/useSanity'
import { TOUR_DATES as FALLBACK_TOUR_DATES } from '../data/bandData'
import { getEffectiveTourStatus, parseTourDate } from '../utils/tourDates'

const DEFAULT_AUTO_SHOW_DAYS = 7
const DEFAULT_RELEASE_AUTO_SHOW_DAYS = 14
const HIDDEN_TOUR_STATUSES = new Set(['cancelled', 'done'])
const RELEASE_TYPES = new Set(['single', 'album', 'merch'])
const MANUAL_PRIORITY = {
  urgent: 85,
  high: 65,
  normal: 5,
}

function parseLocalDate(dateValue) {
  if (!dateValue) return null
  const [year, month, day] = String(dateValue).split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function getAutoShowDays(value) {
  if (value === null || value === undefined || value === '') return DEFAULT_AUTO_SHOW_DAYS
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_AUTO_SHOW_DAYS
}

function getReleaseAutoShowDays(value) {
  if (value === null || value === undefined || value === '') return DEFAULT_RELEASE_AUTO_SHOW_DAYS
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : DEFAULT_RELEASE_AUTO_SHOW_DAYS
}

function isExpired(announcement, now) {
  if (!announcement?.expiresAt) return false
  const expiresAt = new Date(announcement.expiresAt)
  return Number.isFinite(expiresAt.getTime()) && expiresAt < now
}

function isWithinAutoShowWindow(eventDate, now = new Date(), autoShowDays = DEFAULT_AUTO_SHOW_DAYS) {
  if (!eventDate) return false

  const showFrom = new Date(eventDate)
  showFrom.setDate(showFrom.getDate() - autoShowDays)
  showFrom.setHours(0, 0, 0, 0)

  const showUntil = new Date(eventDate)
  showUntil.setHours(23, 59, 59, 999)

  return now >= showFrom && now <= showUntil
}

function formatTourDate(item) {
  return `${item.date || ''} ${item.year || ''}`.trim()
}

function isSameCalendarDay(date, now = new Date()) {
  return date.getFullYear() === now.getFullYear()
    && date.getMonth() === now.getMonth()
    && date.getDate() === now.getDate()
}

function getReleaseLabel(type, isReleaseDay) {
  if (type === 'merch') return isReleaseDay ? 'MERCH LIVE' : 'MERCH DROP'
  if (type === 'album') return isReleaseDay ? 'OUT NOW' : 'NEW ALBUM'
  return isReleaseDay ? 'OUT NOW' : 'NEW SINGLE'
}

function getDefaultReleaseCtaPage(type) {
  return type === 'merch' ? 'merch' : 'discography'
}

function getAnnouncementPriority(value) {
  return MANUAL_PRIORITY[value] ?? MANUAL_PRIORITY.normal
}

function toBannerCandidate(announcement, rank) {
  return {
    ...announcement,
    _rank: rank,
  }
}

function getManualAnnouncementCandidates(announcements, now = new Date()) {
  if (!Array.isArray(announcements)) return []

  return announcements
    .filter(item => item?.title && item.active === true && !isExpired(item, now))
    .map(item => toBannerCandidate(item, getAnnouncementPriority(item.priority)))
}

function getScheduledAnnouncementCandidates(announcements, now = new Date()) {
  if (!Array.isArray(announcements)) return []

  return announcements.flatMap(item => {
    if (!item?.title || item.active === true || isExpired(item, now)) return []

    if (item.announcementType === 'gig') {
      const eventDate = parseLocalDate(item.eventDate)
      if (!isWithinAutoShowWindow(eventDate, now, getAutoShowDays(item.autoShowDaysBefore))) return []
      const isLiveNow = isSameCalendarDay(eventDate, now)

      return [toBannerCandidate({
        ...item,
        title: isLiveNow ? 'LIVE NOW' : 'UPCOMING GIG',
        tone: isLiveNow ? 'urgent' : (item.tone || 'default'),
        isLiveNow,
      }, isLiveNow ? 100 : 70)]
    }

    if (RELEASE_TYPES.has(item.announcementType)) {
      const releaseDate = parseLocalDate(item.releaseDate)
      if (!isWithinAutoShowWindow(releaseDate, now, getReleaseAutoShowDays(item.autoShowDaysBefore))) return []
      const isReleaseDay = isSameCalendarDay(releaseDate, now)
      const urgentRank = item.priority === 'urgent' ? 80 : item.priority === 'high' ? 65 : null
      const baseRank = isReleaseDay ? 60 : 40

      return [toBannerCandidate({
        ...item,
        title: getReleaseLabel(item.announcementType, isReleaseDay),
        ctaPage: item.ctaPage || getDefaultReleaseCtaPage(item.announcementType),
        tone: item.tone || (item.announcementType === 'merch' ? 'merch' : 'release'),
        isReleaseDay,
      }, urgentRank || baseRank)]
    }

    return []
  })
}

function getAutoTourAnnouncement(tourDates, now = new Date()) {
  if (!Array.isArray(tourDates)) return null

  const nextAutoShow = tourDates
    .map(item => ({ item, eventDate: parseTourDate(item) }))
    .filter(({ item, eventDate }) => {
      const status = getEffectiveTourStatus(item, now)
      if (!eventDate || HIDDEN_TOUR_STATUSES.has(status)) return false
      return isWithinAutoShowWindow(eventDate, now)
    })
    .sort((a, b) => a.eventDate - b.eventDate)[0]

  if (!nextAutoShow) return null

  const { item } = nextAutoShow
  const isLiveNow = isSameCalendarDay(nextAutoShow.eventDate, now)
  const status = getEffectiveTourStatus(item, now)
  const dateLabel = formatTourDate(item)
  const venueLabel = item.venue ? ` at ${item.venue}` : ''
  const locationLabel = item.location ? ` - ${item.location}` : ''

  return {
    _id: `auto-tour-${item._id || `${item.date}-${item.year}-${item.venue}`}`,
    title: isLiveNow ? 'LIVE NOW' : 'UPCOMING GIG',
    message: `${dateLabel}${venueLabel}${locationLabel}`,
    ctaLabel: 'VIEW TOUR',
    ctaType: 'page',
    ctaPage: 'tour',
    tone: isLiveNow || status === 'sold-out' ? 'urgent' : 'default',
    isLiveNow,
    _rank: isLiveNow ? 100 : 70,
  }
}

function combineLiveGigAndRelease(liveGig, release) {
  if (!liveGig?.isLiveNow || !release?.isReleaseDay) return null

  return {
    ...liveGig,
    _id: `${liveGig._id}-${release._id}`,
    title: release.announcementType === 'merch' ? 'LIVE NOW / MERCH LIVE' : 'LIVE NOW / OUT NOW',
    message: `${liveGig.message} / ${release.message || release.title}`,
    tone: 'urgent',
    isLiveNow: true,
    _rank: 105,
  }
}

function pickAnnouncement({ announcements, tourDates, dismissedIds }) {
  const now = new Date()
  const autoTourAnnouncement = getAutoTourAnnouncement(tourDates, now)
  const manualCandidates = getManualAnnouncementCandidates(announcements, now)
  const scheduledCandidates = getScheduledAnnouncementCandidates(announcements, now)
  const releaseToday = scheduledCandidates.find(item => item.isReleaseDay && RELEASE_TYPES.has(item.announcementType))
  const combined = combineLiveGigAndRelease(autoTourAnnouncement, releaseToday)

  return [
    combined,
    autoTourAnnouncement,
    ...scheduledCandidates,
    ...manualCandidates,
  ]
    .filter(Boolean)
    .filter(item => !dismissedIds.includes(item._id))
    .sort((a, b) => {
      if (b._rank !== a._rank) return b._rank - a._rank
      return (a.sortOrder ?? 100) - (b.sortOrder ?? 100)
    })[0] || null
}

export default function AnnouncementBanner({ onNavigate, onVisibilityChange }) {
  const [dismissedIds, setDismissedIds] = useState([])
  const { data: announcements } = useSanityQuery(QUERIES.siteAnnouncement, [], { fresh: true })
  const { data: sanityTourDates, loading: tourLoading } = useSanityQuery(QUERIES.tourDates, [], { fresh: true })
  const tourDates = !tourLoading && sanityTourDates.length > 0 ? sanityTourDates : FALLBACK_TOUR_DATES
  const announcement = pickAnnouncement({ announcements, tourDates, dismissedIds })
  const isVisible = Boolean(announcement?.title)

  useEffect(() => {
    onVisibilityChange?.(isVisible)
  }, [isVisible, onVisibilityChange])

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

  const handleDismiss = () => {
    if (!announcement?._id) return
    const nextDismissedIds = [...new Set([...dismissedIds, announcement._id])]
    setDismissedIds(nextDismissedIds)
  }

  return (
    <div className={`announcement-banner announcement-banner--${announcement.tone || 'default'}${announcement.isLiveNow ? ' announcement-banner--live' : ''}`}>
      <span className="announcement-banner__sigil" aria-hidden="true">+</span>
      <div className="announcement-banner__text">
        <strong>{announcement.title}</strong>
        {announcement.message && <span>{announcement.message}</span>}
      </div>
      {hasCta && (
        <button type="button" onClick={handleCta}>
          {announcement.ctaLabel}
        </button>
      )}
      <button
        type="button"
        className="announcement-banner__close"
        aria-label="Dismiss announcement"
        onClick={handleDismiss}
      >
        x
      </button>
    </div>
  )
}
