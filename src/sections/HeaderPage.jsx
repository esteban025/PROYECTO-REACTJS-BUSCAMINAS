export const HeaderPage = () => {
  return(
    <header className="space-y-2 p-4 py-6">
      <h1 className="font-semibold text-center flex justify-center items-center gap-4 principal-title">
        <img className="w-9" src="../src/assets/mina.webp" alt="Imagen de mina" />
        <span className="bg-linear-to-t to-violet-50 from-violet-700 bg-clip-text text-transparent">Buscaminas</span>
        </h1>
      <p className="text-center paragraph-text">¡Bienvenido! Encuentra todas las minas sin detonar ninguna.</p>
    </header>
  )
}