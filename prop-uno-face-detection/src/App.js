import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { drawMesh } from "./utilities";
import Header from "./Components/Header/Header";
import ReturnButton from "./Components/ReturnButton";


function CameraButton({ onClick, cameraPermission }) {
  return (
    <button className="button__camera" onClick={onClick}>
      {cameraPermission ? "Camera permission granted" : "Ask for camera permission"}
    </button>
  );
}

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusMessage2, setStatusMessage2] = useState("");


  const runFacemesh = async () => {
    const net = await facemesh.load(
      facemesh.SupportedPackages.mediapipeFacemesh
    );
    setInterval(() => {
      detect(net);
    }, 1000);
  };

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await net.estimateFaces({ input: video });

      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(() => {
        drawMesh(face, ctx);
      });

      if (face.length > 0) {
        setStatusMessage2("Face detected ready to capture");
      } else {
        setStatusMessage2("");
      }
    }
  };


const runCapture = async function () {
  setStatusMessage("Our servers are checking the captured face identity");

  const screenshot = webcamRef.current.getScreenshot();
  const response = await fetch("http://localhost:3001/detect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image: screenshot }),
  });

  if (response.status === 500) {
    setStatusMessage("Unknown");
  } else {
    const result = await response.json();
    setStatusMessage(`Identified (${result.firstName} ${result.lastName})`);
  }

  // Add countdown timer and clear status message after 5 seconds
  let count = 5;
  const countdownTimer = setInterval(() => {
    setStatusMessage(`Updating wait-list (${count}s)`);
    count--;
  }, 1000);

  setTimeout(() => {
    clearInterval(countdownTimer);
    setStatusMessage("");
  }, 5000);
};

  const [cameraPermission, setCameraPermission] = useState(false);
  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setPermissionStatus(true);
      setCameraPermission(true);
      stream.getTracks().forEach(x=>x.stop());
    } catch(err) {
      setPermissionStatus(false);
      setCameraPermission(false);
    }
  };
  

  useEffect(() => {
    const webcamVideo = webcamRef.current.video;
    if (webcamVideo) {
      webcamVideo.setAttribute('autoplay', '');
      webcamVideo.setAttribute('muted', '');
      webcamVideo.setAttribute('playsinline', '');
    }
  
    checkCameraPermission();
    runFacemesh();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
      <div>
        <div className="header__aaa" >
            <Header />
            <ReturnButton />
            </div>
        </div>
        <div>
          <CameraButton className="button__camera" onClick={checkCameraPermission} cameraPermission={cameraPermission} />
        </div>
        <Webcam
          ref={webcamRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
          playsInline
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />
        <button className="button-capture" style={{marginTop: '35rem'}} onClick={runCapture}>Capture</button>
        <div>{statusMessage}</div>
        <div>{statusMessage2}</div>
      </header>
    </div>
  );
}

export default App;
