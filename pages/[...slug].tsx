import { useRouter } from 'next/router';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

interface Props extends ParsedUrlQuery {
  slug: string[];
}

function castArray<T>(val: T | T[]): T[] {
  return Array.isArray(val) ? val : [val];
}

export default function DynamicPage({ slug }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return <div>DYNAMIC PAGE: {slug}</div>;
}

export const getStaticPaths: GetStaticPaths<Props> = async () => {
  return {
    paths: [{ params: { slug: ['slug-1'] } }],
    fallback: true,
  };
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slug = castArray(context.params.slug);
  if (slug.length === 1 && slug[0] === 'test') {
    return {
      redirect: {
        permanent: false,
        destination: 'forbidden',
      },
      revalidate: 1,
    };
  }
  return {
    props: {
      slug,
    },
    revalidate: 1,
  };
}
