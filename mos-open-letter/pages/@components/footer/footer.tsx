import { FunctionComponent } from 'react'
import styles from '../../index.module.scss'

const Footer: FunctionComponent = () => {
  return (
    <footer className={styles.footer}>
      <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col justify-center items-center gap-6 lg:flex-row lg:justify-between">
        <div className="flex flex-col justify-center items-center gap-6 lg:flex-row lg:justify-between">
          © 2022 Moments of Space Ltd
          <br />
          community@momentsofspace.com
        </div>
        <div className="flex flex-col justify-center items-center gap-6 lg:flex-row lg:justify-between">
          <a
            href="https://www.momentsofspace.com/"
            rel="noreferrer"
            target="_blank"
          >
            Go to website
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
