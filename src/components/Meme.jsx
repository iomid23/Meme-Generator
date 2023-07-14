import React, { useEffect, useState, useRef } from "react";
import domToImage from "dom-to-image";
import { ChromePicker } from "react-color";

function Meme() {
  const [memes, setMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [textColor, setTextColor] = useState("#ffffff");
  const [textSize, setTextSize] = useState(24);
  const memeRef = useRef(null);
  const topTextRef = useRef(null);
  const bottomTextRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((res) => {
        const memes = res.data.memes;
        setMemes(memes);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    if (generatedImage) {
      const downloadLink = document.createElement("a");
      downloadLink.href = generatedImage;
      downloadLink.download = "meme.png";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }, [generatedImage]);

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
    domToImage
      .toPng(memeRef.current, { quality: 1 })
      .then((dataUrl) => {
        setGeneratedImage(dataUrl);
      })
      .catch((error) => {
        console.log("Error generating meme:", error);
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

  function handleDragStart(event) {
    setDragging(true);
    const { offsetLeft, offsetTop } = event.target;
    const { clientX, clientY } = event.touches ? event.touches[0] : event;
    setDragOffset({
      x: clientX - offsetLeft,
      y: clientY - offsetTop,
    });
  }

  function handleDragMove(event) {
    if (!dragging) return;
    event.preventDefault();
    const { clientX, clientY } = event.touches ? event.touches[0] : event;
    const { x, y } = dragOffset;
    const newX = clientX - x;
    const newY = clientY - y;
    event.target.style.transform = `translate(${newX}px, ${newY}px)`;
  }

  function handleDragEnd() {
    setDragging(false);
  }

  return memes.length ? (
    <div className="container mx-auto mt-8 max-w-lg">
      <div
        className="relative"
        ref={memeRef}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
      >
        <img className="w-full" src={memes[memeIndex].url} alt="meme" />

        <p
          className="text-center font-bold"
          style={{ color: textColor, fontSize: textSize, position: "absolute", top: 0, left: 0 }}
          ref={topTextRef}
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
        >
          {topText}
        </p>

        <p
          className="text-center font-bold"
          style={{ color: textColor, fontSize: textSize, position: "absolute", bottom: 0, left: 0 }}
          ref={bottomTextRef}
          onTouchStart={handleDragStart}
          onMouseDown={handleDragStart}
        >
          {bottomText}
        </p>
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
