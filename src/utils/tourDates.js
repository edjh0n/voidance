const MONTHS = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,
}

export function parseTourDate(item) {
  const [monthName, dayText] = String(item.date || '').trim().toUpperCase().split(/\s+/)
  const month = MONTHS[monthName]
  const day = Number.parseInt(dayText, 10)
  const year = Number.parseInt(item.year, 10)
  if (!Number.isInteger(month) || !day || !year) return null
  return new Date(year, month, day)
}

export function getPastShowsCount(tourDates) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return tourDates
    .map(item => ({ item, parsedDate: parseTourDate(item) }))
    .filter(({ item, parsedDate }) => parsedDate && parsedDate < today && item.status !== 'cancelled')
    .length
}

export function getEffectiveTourStatus(item, now = new Date()) {
  if (item.status === 'cancelled') return 'cancelled'

  const parsedDate = parseTourDate(item)
  if (!parsedDate) return item.status || 'upcoming'

  const today = new Date(now)
  today.setHours(0, 0, 0, 0)
  parsedDate.setHours(0, 0, 0, 0)

  return parsedDate < today ? 'done' : (item.status || 'upcoming')
}

export function getNextShow(tourDates) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return tourDates
    .map(item => ({ item, parsedDate: parseTourDate(item) }))
    .filter(({ item, parsedDate }) => parsedDate && parsedDate >= today && !['cancelled', 'done'].includes(getEffectiveTourStatus(item)))
    .sort((a, b) => a.parsedDate - b.parsedDate)[0]?.item
}

export function sortTourDatesByDate(tourDates, direction = 'desc') {
  const multiplier = direction === 'asc' ? 1 : -1

  return [...tourDates].sort((a, b) => {
    const dateA = parseTourDate(a)
    const dateB = parseTourDate(b)

    if (dateA && dateB) return (dateA - dateB) * multiplier
    if (dateA) return -1
    if (dateB) return 1
    return 0
  })
}
