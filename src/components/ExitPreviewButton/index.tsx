import Link from 'next/link';

import styles from './exitPreviewButton.module.scss';

export function ExitPreviewButton() {
  return (
    <Link href="/api/exit-preview">
      <a className={styles.exitPreview}>Sair do modo Preview</a>
    </Link>
  );
}
