import adapter from 'waku/adapters/default';
import { Slot } from 'waku/minimal/client';
import App from './components/app';
import Article from './components/article';

const ROUTES = [
  { key: '', name: 'Waku', pathname: '/', htmlPath: 'index.html' },
  {
    key: 'foobar',
    name: 'Foobar',
    pathname: '/foobar/',
    htmlPath: 'foobar/index.html',
  },
];

const normalizeRscPath = (rscPath) => rscPath?.replace(/^\/|\/$/g, '') || '';

const getArticleIdFromPathname = (pathname) => {
  const match = pathname.match(/^\/article\/([^/]+)\/?$/);
  return match?.[1] || null;
};

const getArticleIdFromRscPath = (rscPath) => {
  const match = normalizeRscPath(rscPath).match(/^article\/([^/]+)$/);
  return match?.[1] || null;
};

const getRouteFromRscPath = (rscPath) =>
  ROUTES.find((route) => route.key === normalizeRscPath(rscPath)) || ROUTES[0];

const getRouteFromPathname = (pathname) => {
  if (pathname === '/foobar' || pathname === '/foobar/') {
    return ROUTES[1];
  }
  if (pathname === '/') {
    return ROUTES[0];
  }
  return null;
};

export default adapter({
  handleRequest: async (input, { renderRsc, renderHtml }) => {
    if (input.type === 'component') {
      const articleId = getArticleIdFromRscPath(input.rscPath);
      if (articleId) {
        return renderRsc({ App: <Article articleId={articleId} /> });
      }
      const route = getRouteFromRscPath(input.rscPath);
      return renderRsc({ App: <App name={route.name} /> });
    }
    if (input.type === 'custom') {
      const articleId = getArticleIdFromPathname(input.pathname);
      if (articleId) {
        const rscPath = `article/${articleId}`;
        return renderHtml(
          await renderRsc({ App: <Article articleId={articleId} /> }),
          <Slot id="App" />,
          { rscPath },
        );
      }
      const route = getRouteFromPathname(input.pathname);
      if (!route) {
        return;
      }
      return renderHtml(
        await renderRsc({ App: <App name={route.name} /> }),
        <Slot id="App" />,
        {
          rscPath: route.key,
        },
      );
    }
  },
  handleBuild: async ({
    rscPath2pathname,
    renderRsc,
    renderHtml,
    generateFile,
  }) => {
    for (const route of ROUTES) {
      const stream = await renderRsc({ App: <App name={route.name} /> });
      const [stream1, stream2] = stream.tee();
      await generateFile(rscPath2pathname(route.key), stream1);
      const res = await renderHtml(stream2, <Slot id="App" />, {
        rscPath: route.key,
      });
      await generateFile(route.htmlPath, res.body);
    }
  },
});
