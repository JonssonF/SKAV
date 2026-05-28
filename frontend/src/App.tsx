import { createTheme, MantineProvider } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { Notifications } from '@mantine/notifications';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './providers/AuthProvider';
import { AppRouter } from './routes/AppRouter';
import '@mantine/carousel/styles.css';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/dates/styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const theme = createTheme({
  primaryColor: 'blue',
  defaultRadius: 'md',
});

function App() {
  const [colorScheme] = useLocalStorage<'light' | 'dark'>({
    key: 'color-scheme',
    defaultValue: 'light',
  });

  return (
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} forceColorScheme={colorScheme}>
        <Notifications position="top-right" />
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </MantineProvider>
    </QueryClientProvider>
  );
}

export default App;