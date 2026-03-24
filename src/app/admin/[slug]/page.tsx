// app/admin/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import AdminPanel from './AdminPanel';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function AdminPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const { data: barbero } = await supabase
    .from('barberos')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!barbero) return notFound();

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-black p-6 text-white">
          <h1 className="text-xl font-bold">Panel de Control</h1>
          <p className="opacity-70 text-sm">{barbero.nombre_negocio}</p>
        </div>
        <AdminPanel barberoId={barbero.id} />
      </div>
    </div>
  );
}