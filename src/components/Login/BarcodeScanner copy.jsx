import React, { useRef, useEffect, useState } from "react";
import Quagga from "quagga";
import { Button, Input } from "antd";

const BarcodeScanner = () => {
  const videoRef = useRef(null);
  const [scannedData, setScannedData] = useState("");
  const [showVideo, setShowVideo] = useState(false);

  const handleScan = (result) => {
    window.alert("Scanned barcode: " + result.codeResult.code);
    setScannedData(result.codeResult.code);
    setShowVideo(false);
    Quagga.stop();
  };

  const handleScanButton = () => {
    setShowVideo(true);
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "environment" },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        const boxWidth = 200; // Width of the red box
        const boxHeight = 200; // Height of the red box
        const videoWidth = videoRef.current.videoWidth;
        const videoHeight = videoRef.current.videoHeight;

        const offsetX = (videoWidth - boxWidth) / 2;
        const offsetY = (videoHeight - boxHeight) / 2;

        const videoConstraints = {
          width: videoWidth,
          height: videoHeight,
        };

        Quagga.init(
          {
            inputStream: {
              name: "Live",
              type: "LiveStream",
              constraints: {
                ...videoConstraints,
                facingMode: "environment",
              },
              target: videoRef.current,
            },
            decoder: {
              readers: ["ean_reader"],
            },
            locator: {
              patchSize: "medium",
              halfSample: true,
            },
            locate: true,
            area: {
              top: offsetY,
              right: offsetX + boxWidth,
              bottom: offsetY + boxHeight,
              left: offsetX,
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

  useEffect(() => {
    return () => {
      Quagga.stop();
      const videoTracks = videoRef.current.srcObject.getVideoTracks();
      videoTracks.forEach((track) => track.stop());
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {showVideo && (
        <video
          ref={videoRef}
          style={{
            width: "100% ",
            height: "auto",
            objectFit: "cover",
          }}
        />
      )}
      {showVideo && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            border: "2px solid red",
            width: "200px",
            height: "200px",
          }}
        />
      )}
      <Button onClick={handleScanButton} disabled={showVideo}>
        Start Barcode Scanner
      </Button>
      <Input value={scannedData} readOnly />
    </div>
  );
};

export default BarcodeScanner;