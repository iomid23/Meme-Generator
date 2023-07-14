import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { ChromePicker } from "react-color";
import Draggable from "react-draggable";

function Meme() {
  const [memes, setMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(24);
  const memeRef = useRef(null);

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((res) => {
        const memes = res.data.memes;
        setMemes(memes);
      })
      .catch((error) => console.log(error));
  }, []);

  function handleTopTextChange(event) {
    setTopText(event.target.value);
  }

  function handleBottomTextChange(event) {
    setBottomText(event.target.value);
  }

  function handleNextClick() {
    setMemeIndex((memeIndex + 1) % memes.length);
    setGeneratedImage(null);
  }

  function handlePrevClick() {
    setMemeIndex((memeIndex - 1 + memes.length) % memes.length);
    setGeneratedImage(null);
  }

  function handleGenerateMemeClick() {
    html2canvas(memeRef.current).then((canvas) => {
      const generatedImageUrl = canvas.toDataURL("image/png");
      setGeneratedImage(generatedImageUrl);
    });
  }

  function handleResetClick() {
    setTopText("");
    setBottomText("");
    setGeneratedImage(null);
  }

  function handleTextColorChange(color) {
    setTextColor(color.hex);
  }

  function handleTextSizeChange(event) {
    setTextSize(parseInt(event.target.value));
  }

  return memes.length ? (
    <div className="container mx-auto mt-8 max-w-lg">
      <div className="relative">
        <img
          className="w-full"
          src={memes[memeIndex].url}
          alt="meme"
          ref={memeRef}
        />
        <Draggable>
          <p
            className="text-center font-bold"
            style={{ color: textColor, fontSize: textSize }}
          >
            {topText}
          </p>
        </Draggable>
        <Draggable>
          <p
            className="text-center font-bold"
            style={{ color: textColor, fontSize: textSize }}
          >
            {bottomText}
          </p>
        </Draggable>
      </div>

      <input
        type="text"
        className="mb-4 w-full rounded border border-gray-300 p-2 focus:outline-none"
        placeholder="Top Text"
        value={topText}
        onChange={handleTopTextChange}
      />

      <input
        type="text"
        className="mb-4 w-full rounded border border-gray-300 p-2 focus:outline-none"
        placeholder="Bottom Text"
        value={bottomText}
        onChange={handleBottomTextChange}
      />

      <div className="flex justify-center">
        <button
          onClick={handlePrevClick}
          className="mr-2 rounded bg-purple-700 px-4 py-2 text-white"
        >
          Prev
        </button>
        <button
          onClick={handleNextClick}
          className="ml-2 rounded bg-purple-700 px-4 py-2 text-white"
        >
          Next
        </button>
      </div>

      <div className="my-4 flex items-center justify-center">
        <button
          onClick={handleGenerateMemeClick}
          className="rounded bg-blue-500 px-4 py-2 text-white"
        >
          Generate Meme
        </button>
        {generatedImage && (
          <button
            onClick={handleResetClick}
            className="ml-2 rounded bg-red-500 px-4 py-2 text-white"
          >
            Reset
          </button>
        )}
      </div>

      {generatedImage && (
        <div className="text-center">
          <a
            href={generatedImage}
            download="meme.png"
            className="block rounded bg-green-500 px-4 py-2 text-white"
          >
            Download Meme
          </a>
        </div>
      )}

      <div className="mt-4 flex items-center justify-center">
        <div className="mr-4">
          <ChromePicker
            color={textColor}
            onChange={handleTextColorChange}
            disableAlpha={true}
            className="rounded-lg"
          />
        </div>
        <label htmlFor="textSize" className="text-white">
          Text Size:
        </label>
        <input
          type="number"
          id="textSize"
          className="ml-2 rounded border border-gray-300 p-2 focus:outline-none"
          value={textSize}
          onChange={handleTextSizeChange}
        />
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default Meme;