import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';

function Warehouse(){
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({name: '', address: ''});
    const [modalVisible, setModalVisible] = useState(false);
    const [filterName, setFilterName] = useState('');
    const isMountedRef = useRef(false);

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ СКЛАДОВ
    async function GetData(){
        const result = await getAllData("http://localhost:5000/warehouse");
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
    async function AddNewData(){
        const { name, address } = editData;
        if(name.length > 0 && address.length > 0){
            const result = await addData("http://localhost:5000/warehouse/create", {name, address});
            setData([...data, result])
            setModalVisible(false);
            setEditData({ name: '', address: '' });
        }
        else{
            Cancel();
        }
    }
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`http://localhost:5000/warehouse/delete/${id}`);
        if(result){
            const newData = data.filter(item => item.id !== id);
            setData(newData);
        }
    }
    //ОБНОВЛЕНИЕ
    async function UpdateData() {
        const {id, name, address} = editData;
        if(name.length > 0 && address.length > 0){
            const result = await updateData("http://localhost:5000/warehouse/update", {id: Number(id), name, address});
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === id);
                newData[index] = { ...editData};
                console.log(newData[index])
                setData(newData);
            }
            setModalVisible(false);
            setEditData({ name: '', address: '' });
        } else {
            Cancel();
        }
      }
      function EditData(item){
        setEditData(item);
        setModalVisible(true);
    }
    function Cancel(){
        setModalVisible(false);
        setEditData({ name: '', address: '' });
    }
    return (
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                    <input placeholder='Name...' value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}></input>
                    <input placeholder='Address...' value={editData.address} onChange={(e) => setEditData({ ...editData, address: e.target.value })}></input>
                    {!editData.id ? 
                    <button className={styles.modalAddBtn} onClick={AddNewData}>Add</button> :
                    <button className={styles.modalAddBtn} onClick={UpdateData}>Update</button>
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
                                        <button className={styles.removeBtn} onClick={() => RemoveData(item.id)}>Remove</button>
                                        <button className={styles.updateBtn} onClick={() => EditData(item)}>Update</button>
                                    </div>
                                );
                        })}         
                        
            </div>
        </div>
    );
}

export default Warehouse;