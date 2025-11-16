import { useState, useEffect } from 'react'
import { TeamMember } from '../../shared/components'
import './Home.css'

// Team data - easy to edit!
const teamMembers = [
  {
    name: 'Allan Pedin',
    role: 'CEO & Co-Founder',
    bio: 'Published blockchain author with a Master\'s in Computer Science, leading CipherPlay\'s strategic vision',
    imagePath: '/images/headshots/Allan.png'
  },
  {
    name: 'Alex Posey',
    role: 'COO & Co-Founder',
    bio: 'Blockchain researcher with 8+ years experience developing smart contracts and building Web3 protocols',
    imagePath: '/images/headshots/Alex.png'
  },
  {
    name: 'Tyler Warburton',
    role: 'CTO & Co-Founder',
    bio: 'Cybersecurity thought leader and public speaker, architecting next-generation blockchain infrastructure',
    imagePath: '/images/headshots/Tyler.png'
  }
]

// Products data - easy to edit!
const products = [
  {
    name: 'Randao.net',
    type: 'Flagship Product • RNG Protocol',
    description: 'Trustless random number generation protocol on AO blockchain, providing verifiable randomness for Web3 applications.',
    image: '/images/logos/rng-logo.svg',
    link: 'https://randao.net',
    external: true
  },
  {
    name: 'infrAO',
    type: 'Infrastructure • AO Ecosystem',
    description: 'Running critical AO ecosystem nodes including Hyperbeam nodes, MU, SU, and CU units to power the decentralized network.',
    image: '/images/logos/infrao.png',
    link: '#infrastructure',
    external: false
  },
  {
    name: 'arcao',
    type: 'Gaming Studio • Marketing',
    description: 'Onchain Web3 gaming guild and studio with integrated marketing division, building the future of blockchain gaming.',
    image: '/images/logos/arcao.png',
    link: 'https://game.ar.io',
    external: true
  },
  {
    name: 'RuneRealm',
    type: 'Client Project • Gaming',
    description: 'Pokemon-inspired blockchain game leveraging Randao protocol for fair, verifiable gameplay mechanics and item generation.',
    image: '/images/logos/rune-realm-transparent.png',
    link: '#',
    external: false
  },
  {
    name: 'Rewind',
    type: 'Client Project • Archive',
    description: 'Wayback Machine for AR.IO - browse historical snapshots of the permaweb with powerful search and discovery tools.',
    image: '/images/logos/REWIND-WHITE.png',
    link: '#',
    external: false
  }
]

function Home() {
  const [selectedDetail, setSelectedDetail] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Auto-rotate carousel every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="cipherplay-home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-background">
          <div className="grid-overlay"></div>
          <div className="glow-orb glow-orb-1"></div>
          <div className="glow-orb glow-orb-2"></div>
        </div>
        <div className="hero-content">
          <img
            src="/images/logos/LogoText_V1.svg"
            alt="CipherPlay"
            className="hero-logo"
          />
          <h1 className="hero-title">Building the Future of Decentralized Randomness</h1>
          <p className="hero-subtitle">
            Web3 infrastructure, cutting-edge protocols, and blockchain innovation
          </p>
          <div className="hero-cta">
            <a href="#randao" className="btn btn-primary">Explore Randao.net</a>
            <a href="#contact" className="btn btn-secondary">Get in Touch</a>
          </div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Team/Founders Section */}
      <section className="team" id="team">
        <div className="container">
          <h2 className="section-title">Leadership Team</h2>
          <p className="section-subtitle">Experienced founders building the decentralized future</p>
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <TeamMember
                key={index}
                name={member.name}
                role={member.role}
                bio={member.bio}
                imagePath={member.imagePath}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Randao.net Flagship Section */}
      <section className="flagship" id="randao">
        <div className="container">
          <div className="flagship-content">
            <div className="flagship-visual">
              <img
                src="/images/logos/rng-logo.svg"
                alt="Randao.net Protocol"
                className="flagship-image"
              />
              <div className="flagship-glow"></div>
            </div>
            <div className="flagship-info">
              <div className="flagship-badge">Flagship Product</div>
              <h2 className="flagship-title">Randao.net</h2>
              <p className="flagship-tagline">Trustless Random Number Generation on AO Blockchain</p>
              <p className="flagship-description">
                Randao.net is our revolutionary RNG protocol built on the AO blockchain running on Arweave.
                Providing verifiable, unbiased randomness for Web3 applications, gaming, and decentralized systems.
              </p>
              <div className="flagship-features">
                <div className="feature-item">
                  <div className="feature-icon">⚡</div>
                  <div>
                    <h4>Lightning Fast</h4>
                    <p>Sub-second randomness generation</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🔒</div>
                  <div>
                    <h4>Cryptographically Secure</h4>
                    <p>Provably fair and tamper-proof</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="feature-icon">🌐</div>
                  <div>
                    <h4>Decentralized</h4>
                    <p>No single point of failure</p>
                  </div>
                </div>
              </div>
              <a href="https://randao.net" target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                Visit Randao.net →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Consulting Section - Carousel */}
      <section className="products" id="products">
        <div className="products-wrapper">
          <div className="container">
            <h2 className="section-title">Products & Services</h2>
            <p className="section-subtitle">Licensed technology and custom blockchain solutions</p>
          </div>

          <div className="carousel-wrapper">
            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={() => setCurrentSlide((prev) => prev === 0 ? products.length - 1 : prev - 1)}
              aria-label="Previous product"
            >
              ‹
            </button>

            <div className="carousel-viewport">
              <div
                className="carousel-slides"
                style={{
                  transform: `translateX(-${currentSlide * 100}%)`
                }}
              >
                {products.map((product, index) => (
                  <div className="product-slide" key={index}>
                    <div className="product-card">
                      <div className="product-image-wrapper">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-image"
                        />
                      </div>
                      <div className="product-content">
                        <h3 className="product-name">{product.name}</h3>
                        <p className="product-type">{product.type}</p>
                        <p className="product-description">{product.description}</p>
                        {product.external ? (
                          <a href={product.link} target="_blank" rel="noopener noreferrer" className="product-link">
                            Visit {product.name} →
                          </a>
                        ) : (
                          <a href={product.link} className="product-link">Learn More →</a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % products.length)}
              aria-label="Next product"
            >
              ›
            </button>
          </div>

          <div className="carousel-indicators">
            {products.map((_, index) => (
              <button
                key={index}
                className={`carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Infrastructure Section */}
      <section className="infrastructure" id="infrastructure">
        <div className="container">
          <h2 className="section-title">Blockchain Infrastructure</h2>
          <p className="section-subtitle">Running critical nodes to power the decentralized web</p>
          <div className="infra-grid">
            <div className="infra-card">
              <div className="infra-icon">🚀</div>
              <h3>AO Ecosystem Nodes</h3>
              <ul className="infra-list">
                <li>Hyperbeam Nodes</li>
                <li>Messenger Units (MU)</li>
                <li>Scheduler Units (SU)</li>
                <li>Compute Units (CU)</li>
              </ul>
            </div>
            <div className="infra-card">
              <div className="infra-icon">🌐</div>
              <h3>AR.IO Gateways</h3>
              <ul className="infra-list">
                <li>Permaweb Access Points</li>
                <li>High-Availability Infrastructure</li>
                <li>Global Distribution</li>
                <li>Arweave Network Support</li>
              </ul>
            </div>
            <div className="infra-card">
              <div className="infra-icon">⛏️</div>
              <h3>Mining Operations</h3>
              <ul className="infra-list">
                <li>Virginia Blockchain Council Partnership</li>
                <li>Mining Hardware Setup & Management</li>
                <li>Infrastructure Consulting</li>
                <li>Enterprise-Grade Operations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="partners" id="partners">
        <div className="container">
          <h2 className="section-title">Strategic Partners</h2>
          <p className="section-subtitle">Collaborating with industry leaders to build the future</p>
          <div className="partners-grid">
            <div className="partner-card">
              <img
                src="/images/logos/ARIO-Dark.png"
                alt="AR.IO"
                className="partner-logo"
              />
              <h3>AR.IO</h3>
              <p>Permaweb gateway infrastructure partner powering decentralized access to Arweave</p>
            </div>
            <div className="partner-card">
              <img
                src="/images/logos/virginia-blockchain-council.png"
                alt="Virginia Blockchain Council"
                className="partner-logo"
              />
              <h3>Virginia Blockchain Council</h3>
              <p>Strategic partnership for crypto mining hardware setup and blockchain infrastructure consulting</p>
            </div>
            <div className="partner-card partner-card-dual">
              <div className="dual-logo-container">
                <img
                  src="/images/logos/ao.svg"
                  alt="AO"
                  className="partner-logo partner-logo-dual"
                />
                <span className="logo-separator">+</span>
                <img
                  src="/images/logos/ar.png"
                  alt="Arweave"
                  className="partner-logo partner-logo-dual"
                />
              </div>
              <h3>AO & Arweave</h3>
              <p>Built on the hyperscaling onchain compute layer (AO) and permanent data storage blockchain (Arweave)</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact/Footer Section */}
      <section className="contact" id="contact">
        <div className="container">
          <div className="contact-content">
            <div className="contact-info">
              <img
                src="/images/logos/Logo_Solid_LightBlue.svg"
                alt="CipherPlay Logo"
                className="contact-logo"
              />
              <h2>Let's Build Together</h2>
              <p className="contact-description">
                Whether you're seeking investment opportunities, need blockchain infrastructure,
                or want to license our technology - we're here to help shape the decentralized future.
              </p>
              <div className="contact-methods">
                <a href="mailto:hello@cipherplay.com" className="contact-method">
                  <span className="contact-icon">📧</span>
                  <span>hello@cipherplay.com</span>
                </a>
                <a href="https://randao.net" target="_blank" rel="noopener noreferrer" className="contact-method">
                  <span className="contact-icon">🔗</span>
                  <span>randao.net</span>
                </a>
              </div>
            </div>
            <div className="contact-cta">
              <h3>Ready to get started?</h3>
              <p>Connect with our team to discuss partnerships, investments, or custom solutions.</p>
              <a href="mailto:hello@cipherplay.com" className="btn btn-primary btn-large">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-links">
              <a href="https://randao.net" target="_blank" rel="noopener noreferrer">Randao.net</a>
              <span className="footer-divider">•</span>
              <a href="#team">Team</a>
              <span className="footer-divider">•</span>
              <a href="#products">Products</a>
              <span className="footer-divider">•</span>
              <a href="#infrastructure">Infrastructure</a>
            </div>
            <p className="footer-copyright">
              © 2024 CipherPlay. Building on Arweave & AO.
            </p>
          </div>
        </div>
      </footer>

      {/* Modal for detailed views */}
      {selectedDetail && (
        <div className="modal-overlay" onClick={() => setSelectedDetail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDetail(null)}>×</button>
            <h2>{selectedDetail}</h2>
            <p>Detailed information coming soon...</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
