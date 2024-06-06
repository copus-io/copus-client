import dynamic from 'next/dynamic';
import Head from 'next/head';

const Layout = dynamic(() => import('src/components/Layout'), {
  ssr: false,
});
const Home = dynamic(() => import('src/pc/Home'), {
  ssr: false,
});

const LandingPage = () => {
  const title = 'Copus - Interconnect inspirations and monetize together!';
  const description =
    'If you like "a Pinterest with creator economy", "a GitHub for creative content", "a collective Obsidian", or "a contemporary Project Xanadu", Copus is your thing!';
  const coverUrl =
    'https://static.copus.io/images/client/202405/dev/1a1333a8138c400c965eca057ef29afb.jpg';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:title" content={title}></meta>
        <meta property="og:description" content={description}></meta>

        <meta property="og:image" content={coverUrl}></meta>
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:site" content="Copus" />
        <meta name="twitter:title" content={title}></meta>
        <meta name="twitter:type" content="website" />
        <meta name="twitter:description" content={description}></meta>
        <meta name="twitter:image" content={coverUrl}></meta>
      </Head>
      <Layout>
        <Home />
      </Layout>
    </>
  );
};
export default LandingPage;
