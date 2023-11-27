import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react';

interface IFinalPinModal {
  isOpen: boolean;
}

export const FinalPinModal = (props: IFinalPinModal): JSX.Element => {
  const pin = '1234';
  return (
    <Modal isOpen={props.isOpen} onClose={() => {}}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Congrats Nerd</ModalHeader>
        <ModalBody>{pin}</ModalBody>
      </ModalContent>
    </Modal>
  );
};
