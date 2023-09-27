import React, { useRef, useEffect, useState } from "react";
import Quagga from "quagga";
import { Button, Input } from "antd";

const BarcodeScanner = (props) => {
  const firstUpdate = useRef(true);
  const [isStart, setIsStart] = useState(false);
  const [barcode, setBarcode] = useState("");

  useEffect(() => {
    return () => {
      if (isStart) stopScanner();
    };
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    if (isStart) startScanner();
    else stopScanner();
  }, [isStart]);

  const _onDetected = (res) => {
    stopScanner();
    setIsStart((prevStart) => !prevStart);
    const { codeResult } = res;
    if (codeResult && codeResult.code) {
      setBarcode(codeResult.code);
    }
  };

  const startScanner = () => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: document.querySelector("#scanner-container"),
          constraints: {
            facingMode: "environment", // or user
          },
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
          return console.log(err);
        }
        Quagga.start();
      }
    );
    Quagga.onDetected(_onDetected);
  };

  const stopScanner = () => {
    Quagga.offProcessed();
    Quagga.offDetected();
    Quagga.stop();
  };
  console.log("Scanner stopped", isStart);
  return (
    <div>
      <Input value={barcode} />
      <span>Barcode: {barcode}</span>
      <button
        onClick={() => setIsStart((prevStart) => !prevStart)}
        style={{ marginBottom: 20 }}
      >
        {isStart ? "Stop" : "Start"}
      </button>
      {isStart && (
        <React.Fragment>
          <div id="scanner-container" />
        </React.Fragment>
      )}
    </div>
  );
};
export default BarcodeScanner;
