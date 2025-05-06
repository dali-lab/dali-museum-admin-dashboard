import { BsX } from "react-icons/bs";
import "./styles.scss";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="shadow" onClick={onClose} />
      <div className="modal">
        <BsX onClick={onClose} className="modal-close-button" />
        <div className={"modal-contents " + (className ?? "")}>{children}</div>
      </div>
    </>
  );
};

export default Modal;
