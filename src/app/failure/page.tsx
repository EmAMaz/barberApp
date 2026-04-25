import Link from 'next/link';

export default function PaymentFailure() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-sm w-full space-y-8">
        {/* Simbolo de error minimalista */}
        <div className="flex justify-start">
          <div className="h-1 w-12 bg-red-500" />
        </div>

        <header className="space-y-2">
          <h1 className="text-2xl font-light tracking-tight text-neutral-900 uppercase">
            Pago fallido
          </h1>
          <p className="text-sm text-neutral-500 leading-relaxed">
            No se pudo completar la transacción. Por favor, verifica los datos de tu tarjeta o intenta con otro medio de pago.
          </p>
        </header>

        <section className="pt-4 space-y-3">
          {/* <Link
            href="/checkout"
            className="block w-full py-3 text-center bg-neutral-900 text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors duration-300"
          >
            Reintentar proceso
          </Link> */}
          
          <Link
            href="/"
            className="block w-full py-3 text-center border border-neutral-200 text-neutral-500 text-xs uppercase tracking-widest hover:bg-neutral-50 transition-colors duration-300"
          >
            Volver al inicio
          </Link>
        </section>

        <footer className="pt-10 border-t border-neutral-100">
          <p className="text-[10px] text-neutral-400 uppercase tracking-tighter">
            BarberFlow &copy; {new Date().getFullYear()} — Soporte técnico disponible
          </p>
        </footer>
      </div>
    </main>
  );
}