import {useState, useEffect, useRef} from 'react';
import styles from '../styles/WarehouseModule.module.css'

function Warehouse(){
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [editId, setEditId] = useState(null);
    const isMountedRef = useRef(false);

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        fetchData();
        isMountedRef.current = true;
    }, [])

    async function fetchData(){
        try {
            await fetch("http://localhost:5000/warehouse",
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                  },
            })
            .then((res) => res.json())
            .then((data) => setData(data))
        } catch (error) {
            console.error(error);
        }
    }

    //УДАЛЕНИЕ
    function RemoveData(id){
        const newData = data.filter(item => item.id !== id);
        setData(newData);
    }
    //ДОБАВЛЕНИЕ
    function AddData(){
        if(name.length > 0 && address.length > 0){
            const newData = {id: data.length + 1, name: name, address: address};
            setData([...data, newData]);
            setModalVisible(false);
            setName('');
            setAddress('');
        }
        else{
            Cancel();
        }
    }
    //ОБНОВЛЕНИЕ
    function UpdateData() {
        if(name.length > 0 && address.length > 0){
            const newData = [...data];
            const index = newData.findIndex(item => item.id === editId);
            newData[index] = {id: editId, name: name, address: address};
            setData(newData);
            setModalVisible(false);
            setEditId(null);
            setName('');
            setAddress('');
        } else {
            Cancel();
        }
      }
      function EditData(id){
        const item = data.find(item => item.id === id);
        setName(item.name);
        setAddress(item.address);
        setEditId(item.id);
        setModalVisible(true);
    }
    function Cancel(){
        setModalVisible(false);
        setName('');
        setAddress('');
    }
    return (
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                    <input placeholder='Name...' value={name} onChange={(e) => setName(e.target.value)}></input>
                    <input placeholder='Address...' value={address} onChange={(e) => setAddress(e.target.value)}></input>
                    {!editId ? 
                    <button className={styles.modalAddBtn} onClick={AddData}>Add</button> :
                    <button className={styles.modalAddBtn} onClick={UpdateData}>Update</button>
                    }
                    
                </div>
            </div>
            )}
            <button className={styles.addBtn} onClick={() => setModalVisible(true)}>Add Data</button>
            <div className={styles.cards}>
                        {!data ? (<div>No warehouse found</div>) : 
                            data.map((item) => {
                                return (
                                    <div key={item.id} className={styles.card}>
                                        <h2>{item.name}</h2>
                                        <h3>{item.address}</h3>
                                        <button className={styles.removeBtn} onClick={() => RemoveData(item.id)}>Remove</button>
                                        <button className={styles.updateBtn} onClick={() => EditData(item.id)}>Update</button>
                                    </div>
                                );
                        })}         
                        
            </div>
        </div>
    );
}

export default Warehouse;