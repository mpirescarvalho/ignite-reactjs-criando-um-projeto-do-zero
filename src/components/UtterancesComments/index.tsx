import { useEffect } from 'react';

interface UtterancesCommentsProps {
  className?: string;
}

export function UtterancesComments(props: UtterancesCommentsProps) {
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
  }, []);

  return (
    <section id="inject-comments-for-uterances" className={props.className} />
  );
}
