"use client";

import { Modal as ModalWeb3 } from "@web3uikit/core";

type ModalProps = {
  width?: string;
  headerText: string;
  isVisible: boolean;
  content?: React.ReactNode;
  onOk?: () => void;
  onCloseButtonPressed?: () => void;
};

const Modal = ({
  onOk,
  width,
  content,
  isVisible,
  headerText,
  onCloseButtonPressed,
}: ModalProps): JSX.Element => {
  const customize = {
    fontSize: "20px",
  };

  return (
    <>
      {isVisible && (
        <ModalWeb3
          onCloseButtonPressed={onCloseButtonPressed}
          onOk={onOk}
          title={headerText}
          hasFooter={false}
          isVisible={isVisible}
          width={width}
          customize={customize}
        >
          <div>{content}</div>
        </ModalWeb3>
      )}
    </>
  );
};

export default Modal;
