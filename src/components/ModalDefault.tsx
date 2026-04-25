"use client";

import { CheckCircle } from "@deemlol/next-icons";
import { Button, Modal } from "@heroui/react";

export function ModalDefault({ ...props }: any) {
  return (
      <Modal.Backdrop isOpen={props.isOpen} onOpenChange={props.setIsOpen}>
        <Modal.Container>
          <Modal.Dialog className="sm:max-w-90">
            <Modal.Header>
              <Modal.Icon className="bg-success text-success-soft-foreground">
                <CheckCircle size={128} color="#FFFFFF" strokeWidth={1.5} />
              </Modal.Icon>
              <Modal.Heading>Publicar agenda</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <p>
                ¿Publicar turnos de {props.config.duracion}min desde las {props.config.inicio} hasta las {props.config.fin}?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="secondary">Cancelar</Button>
              <Button onClick={props.generarAgendaHoy}>Confirmar</Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
  );
}
