// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import appLogo from '/favicon.svg'
import PWABadge from './PWABadge.tsx'
import './App.css'

import P5Sketch from './P5Sketch.jsx';
import webcamSketch from './sketch.js';

// import VideoClassifier from './VideoClassifier';


function App() {
  return (
    <>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={appLogo} className="logo" alt="lost-souls-vite-pwa logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>lost-souls-vite-pwa</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
      {/* <VideoClassifier /> */}
      <P5Sketch sketch={webcamSketch} />
      <PWABadge />
    </>
  )
}

export default App
