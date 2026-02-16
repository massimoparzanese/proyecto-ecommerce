export default function Home() {
  return (
    <div className="from-muted/30 to-background min-h-screen bg-gradient-to-br">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="from-primary via-accent to-secondary mb-4 bg-gradient-to-r bg-clip-text text-4xl text-transparent md:text-5xl">
            Descubre Productos Increíbles
          </h1>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
            Explora nuestra selección curada de productos de alta calidad a los
            mejores precios
          </p>
        </div>
      </main>
    </div>
  );
}
