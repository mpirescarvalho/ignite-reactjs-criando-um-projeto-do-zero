import { useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

import { getPrismicClient } from '../../services/prismic';
import Header from '../../components/Header';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { UtterancesComments } from '../../components/UtterancesComments';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const estimatedReadMinutes = useMemo(() => {
    if (post) {
      const postTitle = post.data.title;

      const postContent = post.data.content
        .map(content => {
          return `${content.heading} ${RichText.asText(content.body)}`;
        })
        .join('');

      const postText = `${postTitle} ${postContent}`;
      const wordCount = postText.split(' ').length;
      const readMinutes = Math.ceil(wordCount / 200);

      return readMinutes;
    }

    return 0;
  }, [post]);

  if (router.isFallback) {
    return (
      <div className={styles.fallback}>
        <p>Carregando...</p>
      </div>
    );
  }

  const postHtml = post.data.content
    .map(content => {
      return `
        <h1>${content.heading}</h1>
        ${RichText.asHtml(content.body)}
      `;
    })
    .join('');

  return (
    <>
      <Head>
        <title>{post.data.title} | spacetraveling</title>
      </Head>

      <Header className={commonStyles.container} />

      <main className={styles.content}>
        <div className={styles.banner}>
          <Image src={post.data.banner.url} layout="fill" objectFit="cover" />
        </div>

        <article className={commonStyles.container}>
          <header>
            <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <time>
                <FiCalendar width="20" height="20" />
                {format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                  locale: ptBR,
                })}
              </time>
              <span>
                <FiUser width="20" height="20" />
                {post.data.author}
              </span>
              <span>
                <FiClock width="20" height="20" /> {estimatedReadMinutes} min
              </span>
            </div>
          </header>

          <div
            className={styles.postContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: postHtml }}
          />
        </article>

        <UtterancesComments />
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    { fetch: [], pageSize: 10, orderings: '[posts.first_publication_date]' }
  );

  const paths = posts.results.map(post => {
    return {
      params: {
        slug: post.uid,
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const slug = context.params.slug as string;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', slug, {});

  return {
    props: {
      post: response,
    },
  };
};
