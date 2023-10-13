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
          style={{
            right: 24,
          }}
        >
          Cancelar Scaneo
        </FloatButton>
      ) : (
        <div>
          {scanMethod === "computer" ? (
            <FloatButton
              onClick={() => startQrCodeScanner("environment")}
              icon={<SecurityScanTwoTone />}
              description="SCAN"
              style={{
                right: 24,
              }}
            ></FloatButton>
          ) : (
            <FloatButton
              onClick={() => startQrCodeScanner("environment")}
              icon={<SecurityScanTwoTone />}
              description="SCAN"
              style={{
                right: 24,
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
