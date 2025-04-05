'use client';
import React from 'react';
import {RiCloseLine} from "@remixicon/react";
import Label from "@/components/Label";

const CloseButton = ({handleClose, showLabel = true, labelText = "Close"}: {
  handleClose: () => void;
  showLabel?: boolean;
  labelText?: string;
}) => {

  return (
    <button className="hover-btn group relative" onClick={handleClose}>
      <RiCloseLine className="group-hover:text-accent group-hover:rotate-90 duration-200" />
      {showLabel && (
        <Label text={labelText} />
      )}
    </button>
  );
};

export default CloseButton;