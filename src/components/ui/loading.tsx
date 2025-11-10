import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid" />
    </div>
  );
};

export default Loading;
