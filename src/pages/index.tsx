import Image from 'next/image';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { FiCalendar, FiCallback, FiUser } from 'react-icons/fi';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(props: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>

      <div className={commonStyles.container}>
        <header className={`${styles.header} ${styles.headerSpacing}`}>
          <Image src="/images/logo.svg" width="239" height="27" alt="logo" />
        </header>

        <main>
          <div className={styles.postList}>
            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>

            <div className={styles.post}>
              <h1>Como utilizar Hooks</h1>
              <p>Pensando em sincronização em vez de ciclos de vida.</p>
              <footer>
                <time>
                  <FiCalendar width="20" height="20" />
                  15 Mar 2021
                </time>
                <span>
                  <FiUser width="20" height="20" />
                  Marcelo Carvalho
                </span>
              </footer>
            </div>
          </div>

          <button className={styles.loadPosts} type="button">
            Carregar mais posts
          </button>
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  // const postsResponse = await prismic.query();

  return {
    props: {},
  };
};
