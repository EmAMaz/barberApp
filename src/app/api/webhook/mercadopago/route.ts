import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    // Mercado Pago envía el ID a veces en la URL y otras en el BODY
    const id = url.searchParams.get("data.id") || body.data?.id || url.searchParams.get("id");
    const type = url.searchParams.get("type") || body.type;

    // Solo nos interesa el evento de tipo "payment"
    if (type === "payment" && id) {
      
      const res = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: { 
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}` 
        }
      });

      if (!res.ok) throw new Error("Error consultando pago en Mercado Pago");
      
      const payment = await res.json();

      // Verificamos si el pago fue aprobado
      if (payment.status === "approved" && payment.external_reference) {
        const { turnoId, nombre } = JSON.parse(payment.external_reference);

        // Actualizamos Supabase
        const { error } = await supabase
          .from("turnos")
          .update({ 
            esta_disponible: false, 
            cliente_nombre: nombre 
          })
          .eq("id", turnoId);

        if (error) {
          console.error("Error en Supabase:", error);
          return new NextResponse("Error DB", { status: 500 });
        }

        console.log(`✅ Turno ${turnoId} confirmado para ${nombre}`);
      }
    }

    // Siempre responder 200 para que MP no reintente infinitamente
    return new NextResponse("OK", { status: 200 });

  } catch (error) {
    console.error("❌ Webhook Error:", error);
    // Respondemos 500 para que MP sepa que hubo un error y reintente luego
    return new NextResponse("Internal Error", { status: 500 });
  }
}