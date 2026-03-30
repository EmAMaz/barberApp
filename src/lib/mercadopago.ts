import { initMercadoPago } from '@mercadopago/sdk-react';

export const initMP = () => {
  const publicKey = process.env.NEXT_PUBLIC_MP_KEY;
  
  if (!publicKey) {
    console.error("Mercado Pago Public Key no encontrada");
    return;
  }

  initMercadoPago(publicKey, {
    locale: 'es-AR' // O tu país: 'es-MX', 'pt-BR', etc.
  });
};