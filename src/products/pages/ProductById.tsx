import { useParams } from 'react-router-dom'
import { ProductCard, useProduct } from '..'
import { useEffect } from 'react'

export const ProductById = () => {
  const { id } = useParams()

  const { product, isLoading } = useProduct({ id: +id! })

  useEffect(() => {
    // Esta linea hace que al hacer click en un producto y me valla a la pagina del detalle de ese producto, al volver a la pagina anterior, el scroll de la pantalla estara justo donde lo dejamos antes de entrar en el producto
    window.scroll(0, 0)
  })

  return (
    <div className='flex-col'>
      <h1 className='text-2xl font-bold'>Producto</h1>

      {isLoading && <p>Loading...</p>}

      {product && <ProductCard product={product} fullDescription={true} />}
    </div>
  )
}
