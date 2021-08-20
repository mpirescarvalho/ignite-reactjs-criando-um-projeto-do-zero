import { useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiUser, FiClock } from 'react-icons/fi';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

import { getPrismicClient } from '../../services/prismic';

import Header from '../../components/Header';
import { ExitPreviewButton } from '../../components/ExitPreviewButton';
import { UtterancesComments } from '../../components/UtterancesComments';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
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

interface PostLink {
  url: string;
  title: string;
}

interface PostProps {
  post: Post;
  preview: boolean;
  previousPost?: PostLink;
  nextPost?: PostLink;
}

export default function Post({
  post,
  preview,
  previousPost,
  nextPost,
}: PostProps) {
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
            {post.last_publication_date && (
              <time className={styles.lastUpdate}>
                <i>
                  {format(
                    new Date(post.last_publication_date),
                    "'* editado em' dd MMM yyyy', às' HH:mm",
                    {
                      locale: ptBR,
                    }
                  )}
                </i>
              </time>
            )}
          </header>

          <div
            className={styles.postContent}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: postHtml }}
          />
        </article>

        <footer className={`${commonStyles.container} ${styles.footer}`}>
          <div className={styles.postPagination}>
            <div>
              {previousPost && (
                <Link href={previousPost.url}>
                  <a>
                    <span>{previousPost.title}</span>
                    <strong>Post anterior</strong>
                  </a>
                </Link>
              )}
            </div>
            <div>
              {nextPost && (
                <Link href={nextPost.url}>
                  <a>
                    <span>{nextPost.title}</span>
                    <strong>Próximo post</strong>
                  </a>
                </Link>
              )}
            </div>
          </div>

          <UtterancesComments className={styles.comments} />

          {preview && <ExitPreviewButton />}
        </footer>
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

export const getStaticProps: GetStaticProps<PostProps> = async ({
  params,
  preview = false,
  previewData,
}) => {
  const slug = params.slug as string;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', slug, {
    ref: previewData?.ref ?? null,
  });

  const previousPostResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      after: response.id,
      fetch: 'posts.title',
      pageSize: 1,
      orderings: '[document.first_publication_date desc]',
      ref: previewData?.ref ?? null,
    }
  );

  const nextPostResponse = await prismic.query(
    Prismic.Predicates.at('document.type', 'posts'),
    {
      after: response.id,
      fetch: 'posts.title',
      pageSize: 1,
      orderings: '[document.first_publication_date]',
      ref: previewData?.ref ?? null,
    }
  );

  let previousPost: PostLink | undefined;
  let nextPost: PostLink | undefined;

  if (previousPostResponse.results[0]) {
    previousPost = {
      url: `/post/${previousPostResponse.results[0].uid}`,
      title: previousPostResponse.results[0].data.title,
    };
  }

  if (nextPostResponse.results[0]) {
    nextPost = {
      url: `/post/${nextPostResponse.results[0].uid}`,
      title: nextPostResponse.results[0].data.title,
    };
  }

  return {
    props: {
      post: response,
      preview,
      previousPost: previousPost ?? null,
      nextPost: nextPost ?? null,
    },
  };
};
