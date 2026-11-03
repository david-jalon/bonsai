import Avatar from './components/Avatar'
import Bio from './components/Bio'
import { links } from './data/links'
import LinkCard from './components/LinkCard'
import { dropdowns } from './data/links'
import DropdownCard from './components/DropdownCard'
import CVButton from './components/CVButton'
import Footer from './components/Footer'
import ShapeGridBackground from './components/ShapeGridBackground'


function App() {

  return (
    <>
      <div className="min-h-dvh bg-terminal text-text flex flex-col items-center px-4 justify-center py-16 relative">
        <ShapeGridBackground
          className="fixed inset-0 z-0 block w-full h-full opacity-70 grid-canvas"
          direction="diagonal"
          speed={0.4}
          squareSize={40}
          shape="square"
          borderColor="rgba(255, 176, 0, 0.28)"
          hoverFillColor="rgba(255, 176, 0, 0.30)"
        />
        <div className="relative z-10 flex flex-col items-center gap-8 max-w-md w-full">
          <Avatar />
          <Bio />
          <div className="flex flex-col gap-3 w-full items-center">
            {links.map((link) => (
              <LinkCard key={link.label} link={link} />
            ))}
            {dropdowns.map(dropdown => (
              <DropdownCard key={dropdown.label} dropdown={dropdown} />
            ))}
            <CVButton />
          </div>
          <Footer />
        </div>
      </div>

    </>
  )
}

export default App
