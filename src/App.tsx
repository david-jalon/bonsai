import Avatar from './components/Avatar'
import Bio from './components/Bio'
import { links } from './data/links'
import LinkCard from './components/LinkCard'


function App() {

  return (
    <>
      <div className="min-h-screen bg-terminal text-text flex flex-col items-center px-4 justify-center py-16">
        <div className="flex flex-col items-center gap-8 max-w-md w-full">
          <Avatar />
          <Bio />
          <div className="flex flex-col gap-3 w-full items-center">
            {links.map((link) => (
              <LinkCard key={link.label} link={link} />
            ))}
          </div>
        </div>
      </div>

    </>
  )
}

export default App
