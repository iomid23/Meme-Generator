import React from "react";
import Meme from "./components/Meme";
import "./index.css";
import ImageUploader from "./components/ImageUploader";

function App() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-slate-900 p-12">
      <Meme />
      <ImageUploader />
    </div>
  );
}

export default App;
