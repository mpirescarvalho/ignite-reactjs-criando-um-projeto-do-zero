import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface UtterancesCommentsProps {
  className?: string;
}

export function UtterancesComments(props: UtterancesCommentsProps) {
  const router = useRouter();

  useEffect(() => {
    const anchor = document.getElementById('inject-comments-for-uterances');
    const scriptElem = document.createElement('script');
    scriptElem.src = 'https://utteranc.es/client.js';
    scriptElem.async = true;
    scriptElem.crossOrigin = 'anonymous';
    scriptElem.setAttribute(
      'repo',
      'mpirescarvalho/ignite-reactjs-criando-um-projeto-do-zero'
    );
    scriptElem.setAttribute('issue-term', 'pathname');
    scriptElem.setAttribute('theme', 'github-dark');
    anchor.appendChild(scriptElem);
    return () => {
      anchor.removeChild(anchor.firstChild);
    };
  }, [router.asPath]);

  return (
    <section id="inject-comments-for-uterances" className={props.className} />
  );
}
