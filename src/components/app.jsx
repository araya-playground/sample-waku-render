import { Suspense } from 'react';
import { Counter } from './counter';

export const RootLayout = ({ children }) => {
  return (
    <html>
      <head>
        <title>Waku</title>
        <link rel="icon" href="data:," />
      </head>
      <body>{children}</body>
    </html>
  );
};

export const HomePage = () => {
  return (
    <main style={{ border: '3px red dashed', margin: '1em', padding: '1em' }}>
      <h1>Hello Waku!!</h1>
      <h3>This is a server component.</h3>
      <Suspense fallback="Pending...">
        <ServerMessage />
      </Suspense>
      <Counter />
      <div>{new Date().toISOString()}</div>
    </main>
  );
};

const ServerMessage = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return <p>Hello from server!</p>;
};
