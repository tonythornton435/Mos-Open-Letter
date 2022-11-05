import { FunctionComponent } from 'react'
import logoSrc from '../../@assets/images/mos-logo.svg'
import styles from '../../index.module.scss'

const Header: FunctionComponent = () => {
  return (
    <header>
      <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col justify-center items-center gap-6 lg:flex-row lg:justify-between">
        <div className="flex justify-between items-center">
          <img src={logoSrc.src} alt="MOS Logo" className="h-8 w-auto" />
        </div>
        <div className="flex justify-between items-center">
          <a
            className={styles.button}
            href="https://apps.apple.com/gb/app/moments-of-space/id1576497070"
            target="_blank"
            rel="noreferrer"
          >
            Download
          </a>
        </div>
      </div>
    </header>
  )
}

export default Header
