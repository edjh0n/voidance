import { MEMBERS as FALLBACK_MEMBERS } from '../data/bandData'
import { useSanityQuery, QUERIES } from '../hooks/useSanity'

function MemberCard({ member }) {
  return (
    <div className="member-card">
      <div className="member-avatar" data-initials={member.initials} />
      <div className="member-role">{member.role}</div>
      <div className="member-name">{member.name}</div>
      {member.instrument && <div className="member-instrument">{member.instrument}</div>}
      {member.quote && <p className="member-quote">&quot;{member.quote}&quot;</p>}
      {member.socials && Object.keys(member.socials).length > 0 && (
        <div className="member-socials">
          {Object.entries(member.socials).map(([platform, url]) => (
            <a key={platform} href={url} className="member-social-link" target="_blank" rel="noopener">
              {platform}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Members() {
  const { data: members } = useSanityQuery(QUERIES.bandMembers, FALLBACK_MEMBERS)

  return (
    <section id="members">
      <div className="container">
        <div className="section-header">
          <span className="section-num">03 //</span>
          <h2 className="section-title">MEMBERS</h2>
          <div className="section-line" />
        </div>
        <div className="members-grid">
          {members.map(m => <MemberCard key={m._id || m.name} member={m} />)}
        </div>
      </div>
    </section>
  )
}
