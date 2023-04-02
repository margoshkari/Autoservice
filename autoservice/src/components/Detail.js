import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'

function Detail(){
    const [filterModel, setFilterModel] = useState('');
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [model, setModel] = useState('');
    const [vendorCode, setVendorCode] = useState('');
    const [description, setDescription] = useState('');
    const [compatibleVehicles, setCompatibleVehicles] = useState('');
    const [catId, setCatId] = useState(0);
    const [editId, setEditId] = useState(null);
    const isMountedRef = useRef(false);

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetAllData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ ДЕТАЛЕЙ
    async function GetAllData(){
        try {
            await fetch("/detail",
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((res) => res.json())
            .then((data) => {
                setData(data);
            })
        } catch (error) {
            console.error(error);
        }
    }
    //ДОБАВЛЕНИЕ
    async function AddData(){
        await fetch('/detail/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                vendorCode: vendorCode,
                description: description,
                compatibleVehicles: compatibleVehicles,
                catId: Number(catId)
            })
        })
        .then((res) => res.json())
        .then((result) => {
            setData([...data, result]);
        });
        setModalVisible(false);
        setModel('');
        setVendorCode('');
        setDescription('');
        setCompatibleVehicles('');
        setCatId(0);
    };
    //ОБНОВЛЕНИЕ
    async function UpdateData() {
        await fetch(`/detail/update`,
        {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                id: Number(editId),
                model: model,
                vendorCode: vendorCode,
                description: description,
                compatibleVehicles: compatibleVehicles,
                catId: Number(catId)
            })
        })
        .then((res) => res.json())
        .then((result) => 
        {
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === editId);
                newData[index] = {id: editId, model: model, vendorCode: vendorCode, description: description, compatibleVehicles: compatibleVehicles, catId: Number(catId)};
                setData(newData);
            }
        }
        )
        .catch(error => {
            console.log(error)
        })
        setModalVisible(false);
        setEditId(null);
        setModel('');
        setVendorCode('');
        setDescription('');
        setCompatibleVehicles('');
        setCatId(0);
                
      }
      function EditData(id){
        const item = data.find(item => item.id === id);
        setModalVisible(true);
        setEditId(item.id);
        setModel(item.model);
        setVendorCode(item.vendorCode);
        setDescription(item.description);
        setCompatibleVehicles(item.compatibleVehicles);
        setCatId(item.catId);
    }
    function Cancel(){
        setModalVisible(false);
        setModel('');
        setVendorCode('');
        setDescription('');
        setCompatibleVehicles('');
        setCatId(0);
    }
    //УДАЛЕНИЕ
    async function RemoveData(id){
        await fetch(`/detail/delete/${id}`,
            {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                  },
            })
            .then((res) => res.json())
            .then((result) => 
            {
                console.log(result);
                if(result){
                    const newData = data.filter(item => item.id !== id);
                    setData(newData);
                }
            }
            )
            .catch(error => {
                console.log(error)
            })
    }

    return(
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                    <input placeholder='Model...' value={model} onChange={(e) => setModel(e.target.value)}></input>
                    <input placeholder='Vendor Code...' value={vendorCode} onChange={(e) => setVendorCode(e.target.value)}></input>
                    <input placeholder='Description...' value={description} onChange={(e) => setDescription(e.target.value)}></input>
                    <input placeholder='Compatible Vehicles...' value={compatibleVehicles} onChange={(e) => setCompatibleVehicles(e.target.value)}></input>
                    <input type={'number'} placeholder='Category ID...' value={catId} onChange={(e) => setCatId(e.target.value)}></input>
                    {!editId ? 
                    <button className={styles.modalAddBtn} onClick={AddData}>Add</button> :
                    <button className={styles.modalAddBtn} onClick={UpdateData}>Update</button>
                    }
                    
                </div>
            </div>
            )}
            <div>
                <input className={styles.search} placeholder='Model...' value={filterModel} onChange={(e) => setFilterModel(e.target.value)}></input>
            </div>
            <button className={styles.addBtn} onClick={() => setModalVisible(true)}>Add Data</button>
            <div className={styles.cards}>
                        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No detail found</span>) : 
                            data.filter((item) => item.model.toLowerCase().includes(filterModel.toLowerCase())).map((item) => {
                                return (
                                    <div key={item.id} className={styles.card} style={{height: "30vh"}}>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.name}>{item.model}</span>
                                            <span className={styles.address}>{item.vendorCode}</span>
                                            <span className={styles.address}>{item.description}</span>
                                            <span className={styles.address}>{item.compatibleVehicles}</span>
                                            <span className={styles.address}>{item.catId}</span>
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => RemoveData(item.id)}>Remove</button>
                                        <button className={styles.updateBtn} onClick={() => EditData(item.id)}>Update</button>
                                    </div>
                                );
                        })}    
            </div>
        </div>
    );
}

export default Detail;