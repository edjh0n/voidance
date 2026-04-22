import { BAND } from '../data/bandData'

export default function Footer() {
  return (
    <footer>
      <p>&copy; {BAND.formed} VOIDANCE. ALL RIGHTS RESERVED.</p>
      <p>{BAND.origin.toUpperCase()}</p>
      {/* Uncomment when management is available:
      <p>BOOKING: [MANAGEMENT NAME]</p>
      */}
    </footer>
  )
}
