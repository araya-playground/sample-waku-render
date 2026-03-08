import { createPages } from "waku";
import adapter from "waku/adapters/default";

import { HomePage, RootLayout } from "./components/app";
import ArticlePage from "./components/article";

const pages = createPages(async ({ createPage, createRoot }) => [
  createRoot({
    render: "static",
    component: RootLayout,
  }),

  createPage({
    render: "dynamic",
    path: "/",
    component: HomePage,
  }),

  createPage({
    render: "dynamic",
    path: "/article/[articleId]/",
    component: ArticlePage,
  }),
]);

export default adapter(pages);
