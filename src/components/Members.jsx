import { MEMBERS } from '../data/bandData'

function MemberCard({ member }) {
  return (
    <div className="member-card">
      <div className="member-avatar" data-initials={member.initials} />
      <div className="member-role">{member.role}</div>
      <div className="member-name">{member.name}</div>
      {/* Uncomment and populate member.socials when available:
      <div className="member-socials">
        {Object.entries(member.socials).map(([platform, url]) => (
          <a key={platform} href={url} className="member-social-link" target="_blank" rel="noopener">
            {platform}
          </a>
        ))}
      </div>
      */}
    </div>
  )
}

export default function Members() {
  return (
    <section id="members">
      <div className="container">
        <div className="section-header">
          <span className="section-num">02 //</span>
          <h2 className="section-title">THE VOID COLLECTIVE</h2>
          <div className="section-line" />
        </div>
        <div className="members-grid">
          {MEMBERS.map(m => <MemberCard key={m.name} member={m} />)}
        </div>
      </div>
    </section>
  )
}
