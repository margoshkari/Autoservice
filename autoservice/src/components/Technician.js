import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';

function Technician(){
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({name: '', phone: '', specialization: '', startWork: '',startWorkInCompany: ''});
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
    //ПОЛУЧЕНИЕ
    async function GetData(){
        const result = await getAllData("https://localhost:7083/techician");
        setData(result);
    };
     //ДОБАВЛЕНИЕ
     async function AddNewData(){
        const { name, phone, specialization, startWork,startWorkInCompany } = editData;
        const result = await addData("https://localhost:7083/techician/create", {name, phone, specialization, startWork,startWorkInCompany});
            setData([...data, result])
            setModalVisible(false);
            setEditData({name: '', phone: '', specialization: '', startWork: '',startWorkInCompany: ''});
    }
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`https://localhost:7083/techician/delete/${id}`);
        if(result){
            const newData = data.filter(item => item.id !== id);
            setData(newData);
        }
    }
    //ОБНОВЛЕНИЕ
    async function UpdateData() {
        const {id, name, phone, specialization, startWork,startWorkInCompany} = editData;
        const result = await updateData("https://localhost:7083/techician/update", {id: Number(id), name, phone, specialization, startWork,startWorkInCompany});
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === id);
                newData[index] = { ...editData};
                console.log(newData[index])
                setData(newData);
            }
            setModalVisible(false);
            setEditData({name: '', phone: '', specialization: '', startWork: '',startWorkInCompany: ''});
      }
      function EditData(item){
        setEditData(item);
        setModalVisible(true);
    }
    function Cancel(){
        setModalVisible(false);
        setEditData({name: '', phone: '', specialization: '', startWork: '',startWorkInCompany: ''});
    }
    return(
        <div className={styles.content}>
        {modalVisible && (
        <div className={styles.modal}>
            <div className={styles.modalBlock}>
                <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                <input placeholder='Name...' value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}></input>
                <input placeholder='Phone...' value={editData.phone} onChange={(e) => setEditData({ ...editData, phone: e.target.value })}></input>
                <input placeholder='Specialization...' value={editData.specialization} onChange={(e) => setEditData({ ...editData, specialization: e.target.value })}></input>
                <input type={'date'} placeholder='Start Work...' value={editData.startWork} onChange={(e) => setEditData({ ...editData, startWork: e.target.value })}></input>
                <input type={'date'} placeholder='Star Work In Company...' value={editData.startWorkInCompany} onChange={(e) => setEditData({ ...editData, startWorkInCompany: e.target.value })}></input>
                {!editData.id ? 
                <button className={styles.modalAddBtn} onClick={AddNewData}>Add</button> :
                <button className={styles.modalAddBtn} onClick={UpdateData}>Update</button>
                }
                
            </div>
        </div>
        )}
         <div>
            <input className={styles.search} placeholder='Specialization...' value={filterName} onChange={(e) => setFilterName(e.target.value)}></input>
        </div>
        <button className={styles.addBtn} onClick={() => setModalVisible(true)}>Add Data</button>
        <div className={styles.cards}>
        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No warehouse found</span>) : 
                        data.filter((item) => item.specialization.toLowerCase().includes(filterName.toLowerCase())).map((item) => {
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

export default Technician;