import Link from 'next/link'
import { Navbar, Alignment, Tag, Intent } from "@blueprintjs/core";

import styles from './Nav.module.scss'
import Logo from './Logo';
import React from 'react';
import { AmplifySignOut } from '@aws-amplify/ui-react';

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

          <AmplifySignOut />
        </Navbar.Group>
      </div>
    </Navbar>
  )
}

export default Nav;