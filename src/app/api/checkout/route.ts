import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextResponse } from 'next/server';

console.log(process.env.NEXT_PUBLIC_MP_TOKEN)
const client = new MercadoPagoConfig({ 
  accessToken: process.env.NEXT_PUBLIC_MP_TOKEN! 
});

export async function POST(request: Request) {
  try {
    const { turnoId, nombre, barberoId, precio } = await request.json();
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: [
          {
            id: turnoId,
            title: `Seña Turno - ${nombre}`,
            unit_price: Number(precio),
            quantity: 1,
            currency_id: 'ARS'
          }
        ],
        external_reference: JSON.stringify({ turnoId, nombre, barberoId }),
        back_urls: {
          success: `${process.env.NEXT_PUBLIC_URL}/success`,
          failure: `${process.env.NEXT_PUBLIC_URL}/failure`,
          pending: `${process.env.NEXT_PUBLIC_URL}/pending`,
        },
        auto_return: 'approved',
        notification_url: `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/api/webhook/mercadopago`,
      }
    });

    return NextResponse.json({ id: result.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al crear la preferencia' }, { status: 500 });
  }
}