import { useEffect, useState, useRef } from "react"
import { toPng } from "html-to-image"

export default function Main() {
  const memeRef = useRef()

  const [meme, setMeme] = useState({
    topText: "For your mind",
    bottomText: "You get sense",
    imageUrl: "https://i.imgflip.com/1bij.jpg",
  })

  const [allmemes, setAllMemes] = useState([])

  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((res) => res.json())
      .then((data) => setAllMemes(data.data.memes))
  }, [])

  function getMemeImage() {
    const randomNumber = Math.floor(Math.random() * allmemes.length)
    const newMemeUrl = allmemes[randomNumber].url
    setMeme((prevMeme) => ({
      ...prevMeme,
      imageUrl: newMemeUrl,
    }))
  }

  function handleTopTextChange(event) {
    const value = event.target.value
    setMeme((prevValue) => ({
      ...prevValue,
      topText: value,
    }))
  }

  function handleBottomTextChange(event) {
    const value = event.target.value
    setMeme((prevValue) => ({
      ...prevValue,
      bottomText: value,
    }))
  }

  const downloadMeme = () => {
    if (memeRef.current === null) return

    toPng(memeRef.current)
      .then((dataUrl) => {
        const link = document.createElement("a")
        link.download = "meme.png"
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.error("Failed to download meme:", err)
      })
  }

  return (
    <main>
      <div className="general-container">
        <div className="input-containers">
          <div>
            <label htmlFor="topText">Top text</label>
            <input
              type="text"
              name="topText"
              id="topText"
              onChange={handleTopTextChange}
              value={meme.topText}
            />
          </div>

          <div>
            <label htmlFor="bottomText">Bottom text</label>
            <input
              type="text"
              name="bottomText"
              id="bottomText"
              onChange={handleBottomTextChange}
              value={meme.bottomText}
            />
          </div>
        </div>

        <button type="button" onClick={getMemeImage}>
          Get new meme image
        </button>

        <div className="meme" ref={memeRef}>
          <img src={meme.imageUrl} alt="meme" />
          <span className="top">{meme.topText}</span>
          <span className="bottom">{meme.bottomText}</span>
        </div>

        <button onClick={downloadMeme}>Download Meme</button>
      </div>
    </main>
  )
}
