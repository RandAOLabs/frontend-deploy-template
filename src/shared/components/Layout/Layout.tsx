import { Link, useLocation } from 'react-router-dom'
import { ReactNode, useEffect, useState } from 'react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHomePage = location.pathname === '/'

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="layout">
      <nav className={`layout-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <img src="/images/logos/Logo_Solid_LightBlue.svg" alt="CipherPlay" />
          </Link>
          {isHomePage ? (
            <div className="nav-links">
              <a onClick={() => scrollToSection('team')} className="nav-link">Team</a>
              <a onClick={() => scrollToSection('randao')} className="nav-link">Randao</a>
              <a onClick={() => scrollToSection('products')} className="nav-link">Products</a>
              <a onClick={() => scrollToSection('infrastructure')} className="nav-link">Infrastructure</a>
              <a onClick={() => scrollToSection('contact')} className="nav-link nav-link-cta">Contact</a>
            </div>
          ) : (
            <div className="nav-links">
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/about" className="nav-link">About</Link>
            </div>
          )}
        </div>
      </nav>
      <main className="layout-content">
        {children}
      </main>
    </div>
  )
}
