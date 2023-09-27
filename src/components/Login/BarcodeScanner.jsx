import React, { useRef, useEffect, useState } from "react";
import Quagga from "quagga";
import { Button } from "antd";

const BarcodeScanner = React.forwardRef((props, ref) => {
 
  
  const firstUpdate = useRef(true);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    return () => {
      if (isStart) stopScanner();
    };
  }, [isStart]);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
    } else {
      if (isStart) startScanner();
      else stopScanner();
    }
  }, [isStart]);

  const _onDetected = (res) => {
    stopScanner();
    setIsStart(prevStart => !prevStart);
    const { codeResult } = res;
    if (codeResult && codeResult.code) {
      props.handleCallback(codeResult.code);
    }
  };

  const xx = (res) => {
   
    setIsStart(prevStart => !prevStart);
 
  };
  const startScanner = () => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          target: document.querySelector("#scanner-container"),
          constraints: {
            facingMode: "environment",
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

   // Expose the start function through the ref
   React.useImperativeHandle(ref, () => ({
    start: xx,
  }));


  return (
    <div>
      <Button
        onClick={() => setIsStart(prevStart => !prevStart)}
        style={{ marginBottom: 20 }}
      >
        {isStart ? "Stop" : "Start"}
      </Button>
      {isStart && (
        <div id="scanner-container"></div>
      )}
    </div>
  );
});

export default BarcodeScanner;