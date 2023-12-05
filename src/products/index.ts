export { useProducts } from './hooks/useProducts'
export { useProduct } from './hooks/useProduct'
export { usePrefetchProduct } from './hooks/usePrefetchProduct'

export { productsApi } from './api/productsApi'

export { ProductCard } from './components/ProductCard'
export { ProductList } from './components/ProductList'
export type { Product } from './interfaces/product'



export { StoreLayout } from './layout/StoreLayout'

export { CompleteListPage } from './pages/CompleteListPage'
export { MensPage } from './pages/MensPage'
export { NewProduct } from './pages/NewProduct'
export { WomensPage } from './pages/WomensPage'
export { ProductById } from './pages/ProductById'

// De esta forma exportamos todas las acciones para tenerlas centralizadas en un solo nombre, y para llamar a una action solamente seria productActions.getProducts()
export * as productActions from './services/actions'
