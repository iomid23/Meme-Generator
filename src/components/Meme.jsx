import React, { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";

function Meme() {
  const [memes, setMemes] = useState([]);
  const [memeIndex, setMemeIndex] = useState(0);
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
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

  return memes.length ? (
    <div className="container mx-auto mt-8 max-w-lg">
      <div className="relative flex items-center justify-center">
        <img
          className="max-h-96 w-full rounded object-cover"
          src={memes[memeIndex].url}
          alt="meme"
          ref={memeRef}
        />
        <div className="pointer-events-none absolute left-0 top-0 flex h-full w-full flex-col items-center justify-center">
          <p className="text-center text-lg font-bold text-white">{topText}</p>
          <p className="text-center text-lg font-bold text-white">
            {bottomText}
          </p>
        </div>
      </div>

      <input
        type="text"
        className="mb-4 mt-4 w-full rounded border border-gray-300 p-2 focus:outline-none"
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

      <div className="my-4 flex justify-center">
        <button
          onClick={handleGenerateMemeClick}
          className="rounded bg-purple-700 px-4 py-2 text-white"
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
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default Meme;
