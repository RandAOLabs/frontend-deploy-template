interface TeamMemberProps {
  name: string
  role: string
  bio: string
  imagePath: string
}

export function TeamMember({ name, role, bio, imagePath }: TeamMemberProps) {
  return (
    <div className="team-member">
      <div className="member-image-wrapper">
        <img
          src={imagePath}
          alt={name}
          className="member-image"
        />
        <div className="member-overlay"></div>
      </div>
      <h3 className="member-name">{name}</h3>
      <p className="member-role">{role}</p>
      <p className="member-bio">{bio}</p>
    </div>
  )
}
