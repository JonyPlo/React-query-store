import { useQueryClient } from '@tanstack/react-query'
import { productActions } from '..'

export const usePrefetchProduct = () => {
  const queryClient = useQueryClient()

  const preFetchProduct = (id: number) => {
    // Con prefetchQuery estoy indicando que busque una key con el nombre ['product', id] en la cache, y si la encuentra, que use directamente esos datos y no se realice una nueva peticion, pero si no encuentra una key con ese nombre, entonces creara una key llamada ['product', id] y realizara la peticion.
    queryClient.prefetchQuery({
      queryKey: ['product', id],
      queryFn: () => productActions.getProductById(id),
    })
  }

  return preFetchProduct
}
