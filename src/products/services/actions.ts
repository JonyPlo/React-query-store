import { type Product, productsApi } from '..'

interface GetProductsOptions {
  filterKey?: string
}

// Funcion para demorar las peticiones algunos segundos si es necesario probar algo
export const sleep = (seconds: number): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, seconds * 1000)
  })
}

export const getProducts = async ({
  filterKey,
}: GetProductsOptions): Promise<Product[]> => {
  const filterUrl = filterKey ? `category=${filterKey}` : ''

  const { data } = await productsApi.get<Product[]>(`/products?${filterUrl}`)
  return data
}

export const getProductById = async (id: number): Promise<Product> => {
  const { data } = await productsApi.get<Product>(`/products/${id}`)
  return data
}

interface ProductLike {
  id?: number
  title: string
  price: number
  description: string
  category: string
  image: string
}

export const createProduct = async (
  product: ProductLike
): Promise<Product> => {
  await sleep(5)

// throw new Error('Error al crear el producto')

  const { data } = await productsApi.post<Product>('/products', product)
  return data
}
