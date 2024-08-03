"use client";
import React, { useState } from 'react';
import './deletePopup.css';
import { Button } from '@/components/ui/button';
import { TbTrashXFilled } from "react-icons/tb";

const DeletePopup = () => {
  const [showWindow, setShowWindow] = useState(false);

  const toggleWindow = () => {
    setShowWindow(!showWindow);
  };

  return (
    <>
      <button onClick={toggleWindow}><TbTrashXFilled/></button>
      {showWindow && (
        <div className="popup">
          <button className="popup-button">Confirm</button>
          <button className="popup-button">Cancel</button>
        </div>
      )}
  </>
  );
};

export default DeletePopup;
