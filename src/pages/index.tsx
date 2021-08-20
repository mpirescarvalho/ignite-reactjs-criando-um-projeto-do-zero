import { useState } from 'react';
import Head from 'next/head';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';

import { getPrismicClient } from '../services/prismic';
import { PostList } from '../components/PostList';
import Header from '../components/Header';
import { ExitPreviewButton } from '../components/ExitPreviewButton';

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
  preview: boolean;
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
        <Header className={styles.headerSpacing} />

        <main className={styles.main}>
          <PostList posts={posts} />

          {nextPage && (
            <button
              className={styles.loadPosts}
              type="button"
              onClick={handleLoadPosts}
            >
              Carregar mais posts
            </button>
          )}

          {props.preview && <ExitPreviewButton />}
        </main>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({
  preview = false,
  previewData,
}) => {
  const prismic = getPrismicClient();
  const response = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      fetch: ['posts.title', 'posts.subtitle', 'posts.author'],
      pageSize: 2,
      ref: previewData?.ref ?? null,
    }
  );

  return {
    props: {
      postsPagination: response,
      preview,
    },
  };
};
