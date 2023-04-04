import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {GetAllData, AddData, RemoveData, UpdateData} from '../modules/requests';

function Warehouse(){
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [editId, setEditId] = useState(null);
    const [filterName, setFilterName] = useState('');
    const isMountedRef = useRef(false);

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        getData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ СКЛАДОВ
    async function getData(){
        const result = await GetAllData("http://localhost:5000/warehouse");
        setData(result);
      };
    //ПОЛУЧЕНИЕ СКЛАДА ПО ID
    async function GetById(id){
        await fetch(`/warehouse/${id}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
              },
        })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch ((error)=> {
            console.error(error)});
            
    }
    //ДОБАВЛЕНИЕ
    async function addNewData(){
        if(name.length > 0 && address.length > 0){
            const result = await AddData("http://localhost:5000/warehouse/create", {name, address});
            setData([...data, result])
            setModalVisible(false);
            setName('');
            setAddress('');
        }
        else{
            Cancel();
        }
    }
    //УДАЛЕНИЕ
    async function removeData(id){
        const result = await RemoveData(`http://localhost:5000/warehouse/delete/${id}`);
        if(result){
            const newData = data.filter(item => item.id !== id);
            setData(newData);
        }
    }
    //ОБНОВЛЕНИЕ
    async function updateData() {
        if(name.length > 0 && address.length > 0){
            const result = await UpdateData("http://localhost:5000/warehouse/update", {id: editId, name, address});
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === editId);
                newData[index] = {id: editId, name: name, address: address};
                setData(newData);
            }
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
                    <button className={styles.modalAddBtn} onClick={addNewData}>Add</button> :
                    <button className={styles.modalAddBtn} onClick={updateData}>Update</button>
                    }
                    
                </div>
            </div>
            )}
             <div>
                <input className={styles.search} placeholder='Name...' value={filterName} onChange={(e) => setFilterName(e.target.value)}></input>
            </div>
            <button className={styles.addBtn} onClick={() => setModalVisible(true)}>Add Data</button>
            <div className={styles.cards}>
                        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No warehouse found</span>) : 
                            data.filter((item) => item.name.toLowerCase().includes(filterName.toLowerCase())).map((item) => {
                                return (
                                    <div key={item.id} className={styles.card}>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.name}>{item.name}</span>
                                            <span className={styles.address}>{item.address}</span>
                                        </div>
                                        <button className={styles.removeBtn} onClick={() => removeData(item.id)}>Remove</button>
                                        <button className={styles.updateBtn} onClick={() => EditData(item.id)}>Update</button>
                                    </div>
                                );
                        })}         
                        
            </div>
        </div>
    );
}

export default Warehouse;