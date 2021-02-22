import Link from 'next/link'
import { Navbar, Alignment, Tag, Intent } from "@blueprintjs/core";

import styles from './Nav.module.scss'
import Logo from './Logo';

const Nav = () => {
  return (
    <Navbar className={styles.Nav}>
      <div className={styles.NavBar}>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>
            <Link href="/">
              <a>
                <Logo className={styles.Logo} small={true} />
              </a>
            </Link>
          </Navbar.Heading>
        </Navbar.Group>
        <Navbar.Group align={Alignment.RIGHT}>
          {/* @TODO this is stubbed should be real */}
          <Tag intent={Intent.NONE}>v0.1.0</Tag>
        </Navbar.Group>
      </div>
    </Navbar>
  )
}

export default Nav;