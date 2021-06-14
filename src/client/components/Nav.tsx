import Link from 'next/link'
import { Navbar, Alignment, Button, Breadcrumbs, IBreadcrumbProps, Divider, Intent, AnchorButton, Spinner } from "@blueprintjs/core";

import styles from './Nav.module.scss'
import Logo from './Logo';
import React, { Fragment, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const SubNav = () => {
  const router = useRouter()

  const [breadcrumbs, setBreadcrumbs] = useState<IBreadcrumbProps[]>(null);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          text: path.replace(/^\w/, (c) => c.toUpperCase()),
          href: '/' + linkPath.slice(0, i + 1).join('/')
        };
      });

      pathArray.unshift({ text: 'Home', href: '/' })

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <section className={styles.SubNav}>
      <ul className="bp3-overflow-list bp3-breadcrumbs">
        {breadcrumbs.map((breadcrumb, index, array) => {
          const current = array.length == index + 1
          return (
            <li key={index}>
              <Link href={breadcrumb.href}>
                <a className={["bp3-breadcrumb", current ? "bp3-breadcrumb-current" : null].join(" ")} tabIndex={0}>{breadcrumb.text}</a>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

const Nav = () => {
  function isBeneath(path: string) {
    const router = useRouter()

    return !!router.asPath.match(path)
  }

  function isAt(path: string) {
    const router = useRouter()

    return router.asPath == path;
  }

  return (
    <Fragment>
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
            <Link href="/summary">
              <AnchorButton icon="confirm" intent={isAt("/summary") ? "none" : "success"} minimal={isAt("/summary") ? true : false} active={isBeneath("/summary")}>New Summary</AnchorButton>
            </Link>
            <Navbar.Divider />
            <Link href="/extract">
              <AnchorButton icon="import" minimal={true} active={isBeneath("/extract")}>Extract</AnchorButton>
            </Link>
            <Navbar.Divider />
            <Link href="/transform">
              <AnchorButton icon="fork" minimal={true} active={isBeneath("/transform")}>Transform</AnchorButton>
            </Link>
            <Navbar.Divider />
            <Link href="/load">
              <Button icon="cloud-upload" minimal={true} active={isBeneath("/load")}>Load</Button>
            </Link>
          </Navbar.Group>
          <Navbar.Group align={Alignment.RIGHT}>
            {/* @TODO this is stubbed should be real */}
          </Navbar.Group>
        </div>
      </Navbar>
      <SubNav />
      <Divider/>
    </Fragment>
  )
}

export default Nav;