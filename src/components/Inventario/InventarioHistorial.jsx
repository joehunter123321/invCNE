import { Button, Modal, Timeline } from 'antd';
import React, { useState, useEffect, createContext } from "react";
const InventarioHistorial = ({HistorialValue,modalHistorialVisible}) => {
    console.log("InventarioHistorial",HistorialValue,modalHistorialVisible);
    const [modalVisible, setModalVisible] = useState(false);
    const handleHistorial = () => {
      // Lógica para obtener el historial
      // Por ejemplo, supongamos que tienes un array de objetos con eventos históricos
    
  
      Modal.info({
        title: 'Historial',
        content: (
            <Timeline
            mode="alternate"
            items={[
              {
                label: '2015-09-01',
                children: 'Create a services',
              },
              {
                label: '2015-09-01 09:12:11',
                children: 'Solve initial network problems',
              },
              
              {
                label: '2015-09-01 09:12:11',
                children: 'Network problems being solved',
              },
            ]}
          />
        ),
        okText: 'Cerrar',
        onOk: () => {
          setModalVisible(false);
        },
      });
    };
  
    return (
      <div>
        <Button onClick={handleHistorial}>Historial</Button>
      </div>
    );
};

export default InventarioHistorial;
