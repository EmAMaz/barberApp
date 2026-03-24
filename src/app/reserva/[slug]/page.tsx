// app/reserva/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import BookingUI from './BookingUI';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function ReservaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // 1. Buscamos al barbero por su slug (URL)
  const { data: barbero } = await supabase
    .from('barberos')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!barbero) {
    return notFound(); // Esto muestra la página 404 por defecto de Next.js
  }

  // 2. Traemos los turnos de hoy
  const hoy = new Date().toISOString().split('T')[0];
  const { data: turnos } = await supabase
    .from('turnos')
    .select('id, hora, esta_disponible')
    .eq('barbero_id', barbero.id)
    .eq('fecha', hoy)
    .order('hora', { ascending: true });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <BookingUI 
        barbero={barbero} 
        turnosIniciales={turnos || []} 
      />
    </div>
  );
}