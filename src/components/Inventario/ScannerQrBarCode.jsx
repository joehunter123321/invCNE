import React, { useEffect, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { FloatButton, Button } from "antd";
import {
  SecurityScanTwoTone,
  CloseCircleTwoTone,
  ScanOutlined,
} from "@ant-design/icons";
const ScannerQrBarCode = React.forwardRef((props, ref) => {
  const [scanMethod, setScanMethod] = useState("");
  const [qrCodeResult, setQrCodeResult] = useState("");
  const [qrCodeScanner, setQrCodeScanner] = useState(null);
  const [isScanning, setisScanning] = useState(null);

  const startQrCodeScanner = async (facingMode) => {
    setisScanning(true);

    const html5QrCode = new Html5Qrcode("reader");
    setQrCodeScanner(html5QrCode);

    const qrCodeSuccessCallback = (decodedText, decodedResult) => {
      setQrCodeResult(decodedText);
      props.handleCallback(decodedText);
      setisScanning(false);

      html5QrCode.stop();
    };

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    html5QrCode.start({ facingMode }, config, qrCodeSuccessCallback);
  };

  const stopQrCodeScanner = () => {
    if (isScanning) {
      qrCodeScanner.stop();
      setisScanning(false);
    }
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
    <div>
      {isScanning ? (
        <FloatButton
          onClick={stopQrCodeScanner}
          icon={<CloseCircleTwoTone twoToneColor="red" />}
          shape="square"
          style={{
            right: 40,
            bottom: 100, // Cambia la posición vertical
            width: "70px", // Tamaño cuadrado personalizado
            height: "50px",
            borderRadius: "0", // Hacerlo cuadrado
          }}
        >
          Cancelar Scaneo
        </FloatButton>
      ) : (
        <div>
          {scanMethod === "computer" ? (
            <FloatButton
              onClick={() => startQrCodeScanner("environment")}
              shape="square"
              icon={<SecurityScanTwoTone />}
              description="SCAN"
              style={{
                right: 40,
                bottom: 100, // Cambia la posición vertical
                width: "70px", // Tamaño cuadrado personalizado
                height: "50px",
                borderRadius: "0", // Hacerlo cuadrado
              }}
            ></FloatButton>
          ) : (
            <FloatButton
              onClick={() => startQrCodeScanner("environment")}
              shape="square"
              icon={<SecurityScanTwoTone />}
              description="SCAN"
              style={{
                right: 40,
                bottom: 100, // Cambia la posición vertical
                width: "70px", // Tamaño cuadrado personalizado
                height: "50px",
                borderRadius: "0", // Hacerlo cuadrado
              }}
            >
              Scan (Mobile)
            </FloatButton>
          )}
        </div>
      )}

      <div id="reader"></div>
    </div>
  );
});

export default ScannerQrBarCode;
