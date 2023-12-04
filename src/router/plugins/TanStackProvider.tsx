import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

// type Props = {
//   children: ReactNode // <-- Esta seria otra forma de agregar un tipo a un children en react con typescript
// }

// React.PropsWithChildren tambien se usa para especificar el tipado a un children
export const TanStackProvider = ({ children }: React.PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
