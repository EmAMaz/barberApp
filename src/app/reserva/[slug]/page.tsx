"use client";

import BookingUI from "./BookingUI";
import AgendaCerradaUI from "@/components/AgendaCerrada";
import BookingFlow from "@/components/BookingFlow";
import { useGetAgenda } from "@/hooks/useGetAgenda";
import { useParams } from "next/navigation";

export default function ReservaPage() {
  const params = useParams();
  const { agenda } = useGetAgenda();

  console.log(agenda);
  return (
    <div>
      {!agenda && params.slug ? (
        <AgendaCerradaUI perfilNombre={params.slug} />
      ) : (
        //<BookingFlow agendaId={agenda.id} />
        <BookingUI agendaId={agenda.id} />
      )}
    </div>
  );

  // return (
  //   <div className="flex justify-center items-center min-h-screen bg-gray-50">
  //     <BookingUI
  //       barbero={barbero}
  //     />
  //   </div>
  // );
}
