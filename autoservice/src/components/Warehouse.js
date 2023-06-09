import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';

function Warehouse(){
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({name: '', address: ''});
    const [modalVisible, setModalVisible] = useState(false);
    const [filterName, setFilterName] = useState('');
    const isMountedRef = useRef(false); 
    const [validity, setValidity] = useState({
        name: true,
        address: true,
      });

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ СКЛАДОВ
    async function GetData(){
        const result = await getAllData("/warehouse");
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
        setValidity({name: true, address: true});
        if(validate()){
            const { name, address } = editData;
            const result = await addData("/warehouse/create", {name, address});
            setData([...data, result])
            setModalVisible(false);
            setEditData({ name: '', address: '' });
        }
    }
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`/warehouse/delete/${id}`);
        if(result){
            const newData = data.filter(item => item.id !== id);
            setData(newData);
        }
    }
    //ОБНОВЛЕНИЕ
    async function UpdateData() {
        setValidity({name: true, address: true});
        if(validate()){
            const {id, name, address} = editData;
            const result = await updateData("/warehouse/update", {id: Number(id), name, address});
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === id);
                newData[index] = { ...editData};
                console.log(newData[index])
                setData(newData);
            }
            setModalVisible(false);
            setEditData({ name: '', address: '' });
        }
      }
      function EditData(item){
        setEditData(item);
        setModalVisible(true);
        setValidity({name: true, address: true})
    }
    function Cancel(){
        setModalVisible(false);
        setEditData({ name: '', address: '' });
    }
    function validate() {
        let isValid = true;
        if (!editData.name) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, name: false }));
        }
        if (!editData.address) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, address: false }));
        }
        return isValid;
      }
    return (
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                    <input placeholder='Name...' value={editData.name} 
                    className={!validity.name ? styles.invalid : ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}></input>
                    <input placeholder='Address...' value={editData.address} 
                    className={!validity.address ? styles.invalid : ''}
                    onChange={(e) => setEditData({ ...editData, address: e.target.value })}></input>
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
            <button className={styles.addBtn} onClick={() => {
                setModalVisible(true);
                setValidity({name: true, address: true})
                }}>Add Data</button>
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