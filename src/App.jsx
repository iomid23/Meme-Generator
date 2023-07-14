import React from "react";
import Meme from "./components/Meme";
import "./index.css";
import ImageUploader from "./components/ImageUploader";

function App() {
  return (
    <div className="flex justify-center bg-slate-900 flex-col items-center">
      <div className="max-w-lg">
        <Meme />
        <ImageUploader />
      </div>
    </div>
  );
}

export default App;