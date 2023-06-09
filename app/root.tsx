import { LiveReload, Outlet } from '@remix-run/react';
import { ChakraProvider } from '@chakra-ui/react';

export default function App() {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width,initial-scale=1' />
        <title>Meilleur moment pour acheter et pour vendre</title>
      </head>
      <body>
        <ChakraProvider>
          <Outlet />
          <LiveReload />
        </ChakraProvider>
      </body>
    </html>
  );
}
