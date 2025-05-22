import React, { Dispatch, SetStateAction } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  setNewUser?: Dispatch<SetStateAction<NewUser>>;
  setNewPostcard?: Dispatch<SetStateAction<NewPostcard>>;
  setNewAlbum?: Dispatch<SetStateAction<NewAlbum>>;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  setNewUser,
  setNewAlbum,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
          if (setNewUser) {
            setNewUser({
              name: '',
              email: '',
              password: '',
            });
          }
          if (setNewAlbum) {
            setNewAlbum({
              title: '',
              description: '',
              userId: '',
            });
          }
        }
      }}
      onMouseDown={() => {
        onClose();
        if (setNewUser) {
          setNewUser({
            name: '',
            email: '',
            password: '',
          });
        }
      }}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
