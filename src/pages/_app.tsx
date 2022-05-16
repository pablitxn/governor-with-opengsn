import { ChakraProvider, Container } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { GlobalContext } from 'contexts/global';
import useDapp from 'hooks/useDapp';

function MyApp({ Component, pageProps }: AppProps) {
  const { dappState } = useDapp();

  return (
    <ChakraProvider>
      <GlobalContext.Provider value={dappState}>
        <Head>
          <title>Counter with GSN</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        </Head>
        <Container minH="100vh" bg="blue.800" maxW="100%">
          <Component {...pageProps} />
        </Container>
      </GlobalContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
