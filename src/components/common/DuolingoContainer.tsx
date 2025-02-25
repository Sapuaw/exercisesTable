import React from "react";

interface ContentContainerProps {
  children: React.ReactNode;
  width?: string;
  className?: string;
}

const ContentContainer: React.FC<ContentContainerProps> = ({
  width = "max-w-full",
  children,
  className,
}) => {
  return (
    <section
      className={`border-gray-200 md:border-2 md:border-b-4 bg-white p-6 rounded-xl ${width} ${className}`}
    >
      <div className="flex flex-col gap-4 h-full">{children}</div>
    </section>
  );
};

export default ContentContainer;
