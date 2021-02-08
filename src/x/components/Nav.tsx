import Link from 'next/link'
import { Navbar, Alignment } from "@blueprintjs/core";

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
      </div>
    </Navbar>
  )
}

export default Nav;