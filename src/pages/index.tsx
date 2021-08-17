import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import { FiCalendar, FiUser } from 'react-icons/fi';
import Prismic from '@prismicio/client';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';

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
  const [posts, setPosts] = useState<Post[]>(props.postsPagination.results);
  const [nextPage, setNextPage] = useState(props.postsPagination.next_page);

  async function handleLoadPosts() {
    const response = await fetch(nextPage);
    const prismicResponse = await response.json();
    setNextPage(prismicResponse.next_page);
    setPosts([...posts, ...prismicResponse.results]);
  }

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
            {posts.map(post => {
              return (
                <Link href={`/post/${post.uid}`}>
                  <a key={post.uid} className={styles.post}>
                    <h1>{post.data.title}</h1>
                    <p>{post.data.subtitle}</p>
                    <footer>
                      <time>
                        <FiCalendar width="20" height="20" />
                        {format(
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </time>
                      <span>
                        <FiUser width="20" height="20" />
                        {post.data.author}
                      </span>
                    </footer>
                  </a>
                </Link>
              );
            })}
          </div>

          {nextPage && (
            <button
              className={styles.loadPosts}
              type="button"
              onClick={handleLoadPosts}
            >
              Carregar mais posts
            </button>
          )}
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
    }
  );

  return {
    props: {
      postsPagination: response,
    },
  };
};
