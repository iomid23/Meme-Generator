import React, { useState } from "react";

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);

  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
  }

  function handleUpload() {
    console.log(selectedFile);
  }

  return (
    <div className="mt-8 flex max-w-lg justify-center container">
      <div className="flex flex-col  items-center">
        <input
          type="file"
          onChange={handleFileChange}
          className="mb-4 w-full rounded border border-gray-300 bg-white p-2 focus:outline-none"
        />
        <button
          onClick={handleUpload}
          className="rounded bg-purple-700 px-4 py-2 text-white transition-colors duration-300 ease-in-out hover:bg-purple-500"
        >
          Upload
        </button>
      </div>
    </div>
  );
}

export default ImageUploader;
