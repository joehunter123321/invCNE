import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { message, Button } from "antd";

const ScannerQrBarCode = React.forwardRef((props, ref) => {
  const [scanMethod, setScanMethod] = useState("");
  const [qrCodeResult, setQrCodeResult] = useState("");

  const startQrCodeScanner = async (facingMode) => {
    const html5QrCode = new Html5Qrcode("reader");
    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      setQrCodeResult(decodedText);

      props.handleCallback(decodedText);
      html5QrCode.stop(); // Stop QR code scanning
    };

    const config = {
      fps: 2,
      qrbox: { width: 250, height: 250 },
    };

    // Start the QR code scanner
    html5QrCode.start({ facingMode }, config, qrCodeSuccessCallback);
  };

  useEffect(() => {
    const deviceType =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
        ? "mobile"
        : "computer";
    setScanMethod(deviceType);
  }, []);

  return (
    <div style={{}}>
      {scanMethod === "computer" ? (
        <Button onClick={() => startQrCodeScanner("environment")}>
          Scan QR Code (Computer)
        </Button>
      ) : (
        <Button onClick={() => startQrCodeScanner("environment")}>
          Scan QR Code (Mobile)
        </Button>
      )}
      <div id="reader"></div>
    </div>
  );
});

export default ScannerQrBarCode;
