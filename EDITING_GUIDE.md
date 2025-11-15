# CipherPlay Landing Page - Editing Guide

## How to Edit Team Members

The team section is now a reusable component that's super easy to edit!

### Location
Open `src/pages/Home/Home.tsx` and find the `teamMembers` array at the top of the file (around line 6).

### Structure
```typescript
const teamMembers = [
  {
    name: 'Allan Pedin',
    role: 'CEO & Co-Founder',
    bio: 'Published blockchain author with a Master\'s in Computer Science, leading CipherPlay\'s strategic vision',
    imagePath: '/images/headshots/Allan.png'
  },
  // Add more team members here...
]
```

### To Add a New Team Member:
1. Add your team member's headshot to `public/images/headshots/`
2. Add a new object to the `teamMembers` array:
```typescript
{
  name: 'Your Name',
  role: 'Your Title',
  bio: 'Brief bio description',
  imagePath: '/images/headshots/yourname.png'
}
```

### To Edit Existing Members:
Just change the text in the `teamMembers` array - no need to touch any JSX!

## How to Update Product Images

### Current Products:
- **Randao.net**: Line 84 - `/images/logos/rng-logo.svg`
- **RuneRealm**: Line 138 - `/images/logos/rune-realm-transparent.png`
- **Rewind**: Line 157 - `/images/logos/REWIND-WHITE.png`

Simply replace the image files in `public/images/logos/` with your new images (keep the same filenames), or update the `src` paths in `Home.tsx`.

## How to Update Partner Logos

### Current Partners (Line 236-260 in Home.tsx):
- **AR.IO**: `/images/logos/ARIO-Dark.png`
- **Virginia Blockchain Council**: `/images/logos/virginia-blockchain-council.png`

To add more partners, copy the partner-card div structure and add new entries.

## File Structure
```
public/
├── fonts/
│   └── Youre Gone.otf          # Custom CipherPlay font
├── images/
│   ├── headshots/              # Team member photos
│   │   ├── Allan.png
│   │   ├── Alex.png
│   │   └── Tyler.png
│   └── logos/                  # All logo assets
│       ├── Logo_Solid_LightBlue.svg
│       ├── rng-logo.svg
│       ├── rune-realm-transparent.png
│       ├── REWIND-WHITE.png
│       ├── ARIO-Dark.png
│       └── virginia-blockchain-council.png

src/
├── pages/
│   └── Home/
│       ├── Home.tsx            # Main landing page (EDIT HERE)
│       └── Home.css            # Styles
├── shared/
│   └── components/
│       ├── TeamMember/         # Reusable team member component
│       └── Layout/             # Navigation
└── index.css                   # Global styles with brand colors
```

## Brand Colors (in src/index.css)
```css
--color-white: #D9D9D9
--color-gray: #444444
--color-dark-blue: #0E6B99
--color-medium-blue: #1EA5B4
--color-light-blue: #37FFDE
```

## Contact Email
Update the contact email in `Home.tsx` around line 271:
```tsx
<a href="mailto:hello@cipherplay.com">
```

## Running the Site
- **Development**: `npm run dev` → http://localhost:5173
- **Build**: `npm run build`
- **Deploy**: `npm run deploy` (deploys to Arweave via AR.IO)
