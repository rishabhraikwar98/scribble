import React, { useState } from "react";
import Icon from "./Icon";
import { AiOutlineClose } from "react-icons/ai";
const iconColor = "rgb(55 65 81)";
function Modal({ title, isOpen, onClose,children }) {
  
  if (!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50`}
    >
      <div className="lg:w-[500px] w-[360px] bg-gray-50 lg:h-2/3 h-1/2 rounded-xl">
        {/* Content of the modal */}
        <div className="lg:py-4.5 py-4 px-6 border-b border-gray-300 flex align-center justify-between shadow-sm">
          <h1 className="text-xl font-bold">{title}</h1>
          <button onClick={onClose}>
            <Icon size={24} icon={AiOutlineClose} color={iconColor} />
          </button>
        </div>
        <div className="modal-body overflow-y-auto lg:max-h-96 max-h-80 py-5 bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;