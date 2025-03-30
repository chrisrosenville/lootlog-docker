import React, { useEffect, useRef } from "react";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const OutsideClickContainer = ({
  isOpen,
  onClose,
  children,
  ...props
}: Props) => {
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        childRef.current &&
        !childRef.current.contains(event.target as Node)
      ) {
        onClose(); // Call the onClose function when clicked outside
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (isOpen)
    return (
      <div {...props} ref={childRef}>
        {children}
      </div>
    );
};
