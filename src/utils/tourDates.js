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

export function getNextShow(tourDates) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return tourDates
    .map(item => ({ item, parsedDate: parseTourDate(item) }))
    .filter(({ item, parsedDate }) => parsedDate && parsedDate >= today && !['cancelled', 'done'].includes(item.status))
    .sort((a, b) => a.parsedDate - b.parsedDate)[0]?.item
}
