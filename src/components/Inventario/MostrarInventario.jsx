import React, { useState, useRef } from "react";
import {
  Table,
  Input,
  Button,
  Select,
  Modal,
  Form,
  Divider,
  Space,
  Popconfirm,
  Tooltip,
} from "antd";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import CsvDownloader from "react-csv-downloader";

import ScannerQrBarCode from "./ScannerQrBarCode";
import ModalHistorial from "./ModalHistorial";
import TablaInventario from "./TablaInventario";
const { Option } = Select;

function MostrarInventario({ user, loading, userTipo, childData }) {
  const [data, setData] = useState([]);

  //tablaMostrar inmfo
  const [filteredData, setFilteredData] = useState(data);
  const [isFiltered, setIsFiltered] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);
  
  const handleSearchtable = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  
    if (selectedKeys[0]) {
      const newData = data.filter((item) =>
        item[dataIndex].toString().toLowerCase().includes(selectedKeys[0].toLowerCase())
      );
      setFilteredData(newData);
      setIsFiltered(true);
    } else {
      setFilteredData(data);
      setIsFiltered(false);
    }
  };
 
  const handleResettable = (clearFilters) => {
    console.log("handleResettable",isFiltered);
    clearFilters();
  setSearchText('');
  setSearchedColumn('');
  setFilteredData(data); // Reset filtered data to original data
  setIsFiltered(false); // Set isFiltered to false

  console.log("setIsFilteredsetIsFiltered",isFiltered);
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearchtable(selectedKeys, confirm, dataIndex)
          }
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearchtable(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleResettable(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Restablecer
          </Button>
     
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            cerrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1677ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  //////////table
  const [items, setItems] = useState(["Stock"]);
  const [modalHistorialVisible, setModalHistorialVisible] = useState(false);
  const [HistorialValue, setHistorialValue] = useState(null);
  const [historialData, sethistorialData] = useState(null);

  const [name, setName] = useState("");
  const [nameSelected, setnameSelected] = useState("");
  const inputRef = useRef(null);
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  const onNameSelected = (event) => {
    console.log("onNameSelected", event);

    setnameSelected(event);
  };
  const addItem = (e) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };
  const childRef = useRef(null);
  const executeChildFunction = () => {
    if (childRef.current) {
      childRef.current.start();
    }
  };

  const [searchValue, setSearchValue] = useState("");
  const [filterBy, setFilterBy] = useState("IDscanner");

  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();

  const onFinish = (values, record) => {
    handleUpdate(record.IDscanner, nameSelected);
    setModalVisible(false);
    form.resetFields();
  };

  const handleCancel = () => {
    setModalVisible(false);
    form.resetFields();
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleFilterChange = (value) => {
    setFilterBy(value);
  };

  const handleSearch = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, "Inventario"));
      const filteredData = querySnapshot.docs
        .filter((doc) => doc.data()[filterBy] === searchValue)
        .map((doc) => doc.data());
      setData(filteredData);
   


      setSearchText('');
      setSearchedColumn('');
      setFilteredData(data); // Reset filtered data to original data
      setIsFiltered(false); // Set isFiltered to false
   
    } catch (error) {
      console.error("Error fetching elements:", error);
    }
  };

  const handleHistorial = async (value) => {
    try {
      const db = getFirestore();

      const inventarioRef = doc(db, "Inventario", value);
      const inventarioDocSnapshot = await getDoc(inventarioRef);

      if (inventarioDocSnapshot.exists()) {
        const asignadoHistorialRef = collection(
          inventarioRef,
          "AsignadoHistorial"
        );

        const asignadoHistorialSnapshot = await getDocs(asignadoHistorialRef);

        const asignadoHistorialData = asignadoHistorialSnapshot.docs.map(
          (doc) => {
            return {
              color: doc.data().color,
              label: doc.data().AsignadoA,
              children: doc.data().FechaAsignado,
              // Add more key-value pairs as needed with the updated names
            };
          }
        );

        sethistorialData(asignadoHistorialData);
        setModalHistorialVisible(true);
        console.log(
          "setModalHistorialVisible Inventario",
          modalHistorialVisible
        );
      } else {
        console.log("Document does not exist in the 'Inventario' collection.");
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }

    setHistorialValue(value);
  };

  const columns = [
    // Customize columns based on your data requirements
    {
      title: "IDscanner",
      dataIndex: "IDscanner",
      key: "IDscanner",
      fixed: "left",
      width: 100,
    },

    {
      title: "Inventariado Por",
      dataIndex: "InventariadoPorUserEmail",
      key: "InventariadoPorUserEmail",
      ...getColumnSearchProps("InventariadoPorUserEmail"),
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (InventariadoPorUserEmail) => (
        <Tooltip placement="topLeft" title={InventariadoPorUserEmail}>
          {InventariadoPorUserEmail}
        </Tooltip>
      ),
    },
    {
      title: "Inventariado IDentidad",
      dataIndex: "InventariadoPorUserIDentidad",
      key: "InventariadoPorUserIDentidad",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (InventariadoPorUserIDentidad) => (
        <Tooltip placement="topLeft" title={InventariadoPorUserIDentidad}>
          {InventariadoPorUserIDentidad}
        </Tooltip>
      ),
    },
    {
      title: "Estado",
      dataIndex: "Estado",
      key: "Estado",
      width: 100,
      ...getColumnSearchProps("Estado"),
      ellipsis: {
        showTitle: false,
      },
      render: (Estado) => (
        <Tooltip placement="topLeft" title={Estado}>
          {Estado}
        </Tooltip>
      ),
    },
    {
      title: "Categoria",
      dataIndex: "Categoria",
      key: "Categoria",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (Categoria) => (
        <Tooltip placement="topLeft" title={Categoria}>
          {Categoria}
        </Tooltip>
      ),
    },
    {
      title: "subCategoria",
      dataIndex: "subCategoria",
      key: "subCategoria",
      width: 100,
      ...getColumnSearchProps("subCategoria"),
      ellipsis: {
        showTitle: false,
      },
      render: (subCategoria) => (
        <Tooltip placement="topLeft" title={subCategoria}>
          {subCategoria}
        </Tooltip>
      ),
    },
    {
      title: "Ubicación",
      dataIndex: "Ubicacion",
      key: "Ubicacion",
      width: 100,
      ellipsis: {
        showTitle: false,
      },
      render: (Ubicacion) => (
        <Tooltip placement="topLeft" title={Ubicacion}>
          {Ubicacion}
        </Tooltip>
      ),
    },

    {
      title: "Actions",
      dataIndex: "",
      key: "actions",
      width: 250,
      render: (values, record) => (
        <>
          <Modal open={modalVisible} onCancel={handleCancel} footer={null}>
            <Form
              onFinish={() => onFinish(values, record)}
              layout="vertical"
              form={form}
            >
              <Form.Item name="AsignarA" label="AsignadoA">
                <Select
                  onSelect={onNameSelected}
                  value={name}
                  name="AsignarA"
                  style={{
                    width: 300,
                  }}
                  placeholder="custom dropdown render"
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider
                        style={{
                          margin: "8px 0",
                        }}
                      />
                      <Space
                        style={{
                          padding: "0 8px 4px",
                        }}
                      >
                        <Input
                          placeholder="Please enter item"
                          ref={inputRef}
                          value={name}
                          onChange={onNameChange}
                        />
                        <Button
                          type="text"
                          icon={<PlusOutlined />}
                          onClick={addItem}
                        >
                          Add item
                        </Button>
                      </Space>
                    </>
                  )}
                  options={items.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                />
              </Form.Item>

              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </Modal>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              style={{ background: "yellow" }}
              onClick={() => handleHistorial(record.IDscanner)}
            >
              Historial
            </Button>
          </div>
        </>
      ),
    },
  ];
  const columns2 = [
    {
      id: "IDscanner",
      displayName: "IDscanner",
    },
    {
      id: "Categoria",
      displayName: "Categoria",
    },
    {
      id: "subCategoria",
      displayName: "subCategoria",
    },
    {
      id: "InventariadoPorUserIDentidad",
      displayName: "InventariadoPorUserIDentidad",
    },
    {
      id: "InventariadoPorUserEmail",
      displayName: "InventariadoPorUserEmail",
    },
    {
      id: "Estado",
      displayName: "Estado",
    },
    {
      id: "ubicacion",
      displayName: "ubicacion",
    },
  ];

  function qrCodeSuccessCallback(childData) {
    setSearchValue(childData);
  }
  const handleModaHistorialVisible = (isVisible) => {
    // Use the updated modalVisible value here in the parent
    if (isVisible) {
      setModalHistorialVisible(false);
    }
  };


  return (
    <div
      style={{
        padding: "10%",
      }}
    >
      <ModalHistorial
        values={historialData}
        visible={modalHistorialVisible}
        onModalVisible={handleModaHistorialVisible}
      />

      {!user ? null : !loading && user ? (
        <div>
          <ScannerQrBarCode
            fps={10}
            qrbox={250}
            disableFlip={false}
            ref={childRef}
            handleCallback={qrCodeSuccessCallback}
          />
          <Input
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Enter search value"
          />
          <Select value={filterBy} onChange={handleFilterChange}>
            <Option value="IDscanner">IDscanner</Option>
            <Option value="InventariadoPorUserEmail">Correo</Option>
          </Select>

          <Button onClick={handleSearch}>Search</Button>
          <Table
            bordered
            scroll={{ x: 600 }}
            rowKey={(record) => record.IDscanner}
            dataSource={isFiltered ? filteredData : data}
            columns={columns}
          />

          <CsvDownloader
            filename="myfile"
            extension=".csv"
            separator=";"
            wrapColumnChar="'"
            columns={columns2}
            datas={isFiltered ? filteredData : data}
            text="DOWNLOAD"
          />
        </div>
      ) : null}
    </div>
  );
}

export default MostrarInventario;
