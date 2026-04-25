// components/ShareAgenda.tsx
import { Share2, MessageCircle } from "@deemlol/next-icons";

export default function ShareAgenda({ slug, nombreNegocio }: { slug: string, nombreNegocio: string }) {
  
  const shareOnWhatsApp = () => {
    const urlPublica = `https://barberflow.com/${slug}`;
    const mensaje = encodeURIComponent(
      `💈 *${nombreNegocio}* \n` +
      `¡Hola! Ya podés reservar tu turno online para esta semana. \n\n` +
      `👇 Reservá acá fácil y rápido: \n` +
      `${urlPublica}`
    );
    
    // Abrir WhatsApp con el mensaje pre-cargado
    window.open(`https://wa.me/?text=${mensaje}`, '_blank');
  };

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 border border-zinc-100 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-green-500/10 text-green-600 rounded-xl">
          <MessageCircle size={20} />
        </div>
        <h3 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight text-sm">
          Promocioná tu Agenda
        </h3>
      </div>

      <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
        Compartí tu link de reservas en tu **Estado de WhatsApp** o enviáselo a tus clientes por mensaje privado.
      </p>

      <button 
        onClick={shareOnWhatsApp}
        className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-2xl font-black text-sm shadow-lg transition-all active:scale-[0.98]"
      >
        <Share2 size={18} />
        COMPARTIR EN WHATSAPP
      </button>
    </section>
  );
}