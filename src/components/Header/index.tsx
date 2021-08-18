import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

interface HeaderProps {
  className?: string;
}

export default function Header(props: HeaderProps) {
  return (
    <Link href="/">
      <a>
        <header className={`${styles.header} ${props.className}`}>
          <Image src="/images/logo.svg" width="239" height="27" alt="logo" />
        </header>
      </a>
    </Link>
  );
}
