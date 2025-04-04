import React from 'react';

const Label = ({text}: {
  text: string;
}) => {
  return (
    <span className="absolute top-full left-1/2 -translate-x-1/2 hidden group-hover:block mt-2 duration-200 bg-foreground text-background rounded-md items-center justify-center p-1 text-sm whitespace-nowrap">{text}</span>
  );
};

export default Label;