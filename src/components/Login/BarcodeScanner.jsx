import React, { useRef, useEffect, useState } from "react";
import Quagga from "quagga";
import { Button, Input } from "antd";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [cancelScan, setCancelScan] = useState(false);

  const handleScan = (result) => {
    const { codeResult } = result;
    if (codeResult && codeResult.code) {
     
      setScannedData(codeResult.code);
      setShowVideo(false);
    setCancelScan(false);
    }
  };


  const handleScanButton = () => {
    setShowVideo(true);
    setCancelScan(true);
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        const constraints = {
          width: videoRef.current.videoWidth,
          height: videoRef.current.videoHeight,
        };
        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              constraints,
              target: videoRef.current,
            },
            decoder: {
              readers: ["ean_reader"],
            },
            locate: true,
            locator: {
              patchSize: "medium",
              halfSample: true,
            },
          },
          (err) => {
            if (err) {
              console.error("Error initializing Quagga:", err);
              return;
            }
            Quagga.start();
          }
        );

        Quagga.onDetected(handleScan);
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
      });
  };

  const handleCancelScan = () => {
    setShowVideo(false);
    setCancelScan(false);
    Quagga.stop();
  };

  useEffect(
    () => () => {
      Quagga.stop();
    },
    []
  );

  return (
    <div>
      {showVideo && (
        <video
          ref={videoRef}
          style={{ width: "100%", height: "auto", objectFit: "cover" }}
        />
      )}
      {showVideo && (
        <Button onClick={handleCancelScan} style={{ marginTop: "10px" }}>
          Cancel Scan
        </Button>
      )}
      {!showVideo && (
        <Button onClick={handleScanButton} disabled={cancelScan}>
          Start Barcode Scanner
        </Button>
      )}
      <Input value={scannedData}  />
    </div>
  );
};

export default BarcodeScanner;