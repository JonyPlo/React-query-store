import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Product, productActions } from '..'

export const useProductMutation = () => {
  const queryClient = useQueryClient()

  // useMutation es el metodo de react query que usaremos para realizar post, put, delete, etc. y consiste en que la propiedad mutationFn enviara como argumento a la funcion que realiza la peticion el objeto con las propiedades de mi formulario
  // En este caso lo realice de manera implícita, pero para hacerlo de manera explicita para que el codigo sea mas fácil de leer seria de la siguiente forma:
  /*
    mutationFn: (newProduct: FormInputs) =>
    productActions.createProduct(newProduct),
  */
  // El parametro newProduct es el objeto que tiene las propiedades del nuevo producto que lo recibe de la funcion obSubmit en react hook form
  const mutation = useMutation({
    mutationFn: productActions.createProduct,
    // La propiedad onSuccess retorna una funcion si la peticion fue exitosa
    //--------------------------------------
    // La propiedad onMutate ejecuta una funcion bien se presiona el boton para hacer la peticion, diferente al onSuccess que espera a que se obtenga una respuesta de la peticion para ejecutarse
    onMutate: (newProduct) => {
      console.log('Mutando - Optimistic update')

      // Optimistic Product - Un producto optimista es un fake product simplemente para mostrarle algo al usuario hasta que la data este lista
      const optimisticProduct = { id: Math.random(), ...newProduct }

      // Almacenar el producto en el cache del queryClient -  De esta forma no importa que no hayamos obtenido respuesta del servidor con el nuevo producto para mostrarlo, de esta forma inserto un fake product para mostrarlo
      queryClient.setQueryData<Product[]>(
        ['products', { filterKey: newProduct.category }],
        (old) => (old ? [...old, optimisticProduct] : old)
      )

      // El metodo onMutate siempre tiene que retornar algo ya que el metodo onSuccess tomara el valor de este retorno con el parametro 'context' como se ve mas abajo
      return optimisticProduct
    },
    //--------------------------------------
    // La propiedad onSuccess se ejecuta solo despues que se recibió una respuesta de la peticion
    // El metodo onSuccess recibe 3 parametros, el primero que en este caso se llama 'newProduct', es la respuesta que me trae la peticion, el segundo parametro 'variables' es la data que el usuario manda en la peticion, y el tercer parametro 'context' es la informacion que nos regresa el metodo onMutate, en este caso obtendríamos el optimisticProduct
    onSuccess: (newProduct, _variables, context) => {
      // El metodo invalidateQueries lo que hara es tomar una de todas las keys que tiene el queryClient, y para elegir una hay que especificarla en la propiedad queryKey, esto lo que hara es invalidar la key, es decir, si los datos en esa key estan fresh o frescos, los voy a invalidar para que el queryClient entienda y sepa que quiero actualizar o refrescar los datos que tiene esa key, tener en cuenta que despues de realizar la peticion nuevamente porque los datos en la key ya no son frescos se realizara la peticion nuevamente y la key volverá a poner todos los datos como frescos
      // queryClient.invalidateQueries({
      //   queryKey: ['products', { filterKey: `${newProduct.category}` }],
      //--------------------------------------
      // El metodo setQueryData es para sobrescribir una key del queryClient por algún otro dato
      queryClient.setQueryData<Product[]>(
        ['products', { filterKey: newProduct.category }],
        // Desde la version 5 de React Query ahora este segundo parametro es una funcion que retorna un operador ternario
        // El parametro "old" representa toda la data que tiene la key ['products', { filterKey: newProduct.category }], entonces si la key ya tiene datos, en lugar de remplazar todo por el nuevo producto, solo lo concatenamos al final, quedando todos los productos viejos y el producto nuevo al final
        // (old) => (old ? [...old, newProduct] : old)
        (old) => {
          if (!old) return [newProduct]
          // Despues que se realizo la peticion y obtuvimos el nuevo producto, es momento de quitar el producto optimista o fake product y poner el nuevo producto real en su lugar, en este caso buscamos si el id de algún producto que ya esta guardado en la cache coincide con el id del fake product, si coincide reemplazamos el fake product por el nuevo que viene desde la peticion
          return old.map((cacheProduct) => {
            return cacheProduct.id === context?.id ? newProduct : cacheProduct
          })
        }
      )
      //--------------------------------------
      // Con esto eliminamos el context o fake product que quedo guardado en la cache y asi mantenemos limpia la cache del navegador
      queryClient.removeQueries({
        queryKey: ['product', context?.id],
      })
    },
    //--------------------------------------
    // El metodo onError es similar al metodo onSuccess, recibe los mismos parametros pero solo se ejecuta cuando hubo un problema con la peticion
    onError: (_error, variables, context) => {
      queryClient.removeQueries({
        queryKey: ['product', context?.id],
      })

      // Recorro todos los productos en la cache y quito el fake product si la peticion falla
      queryClient.setQueryData<Product[]>(
        ['products', { filterKey: variables.category }],
        (old) => {
          if (!old) return []

          return old.filter((cacheProduct) => {
            return cacheProduct.id !== context?.id
          })
        }
      )
    },
  })

  return mutation
}
