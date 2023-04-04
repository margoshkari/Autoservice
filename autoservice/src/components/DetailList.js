import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';

function DetailList(){
    const [data, setData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const isMountedRef = useRef(false);
    const [warehouseId, setWarehouseId] = useState(0);
    const [detailId, setDetailId] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetAllData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ СПИСКОВ
    async function GetAllData(){
        const result = await getAllData("http://localhost:5000/detailList");
        setData(result);
    }
    //ДОБАВЛЕНИЕ
    async function AddData(){
        const result = await addData("http://localhost:5000/detailList/create", {
            warehouseId: Number(warehouseId),
            detailId: Number(detailId),
            count: Number(count)
            });
        setData([...data, result]);
        setModalVisible(false);
        setWarehouseId(0);
        setDetailId(0);
        setCount(0);
    };
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`http://localhost:5000/detailList/delete/${id}`);
        if(result){
            const newData = data.filter(item => item.id !== id);
            setData(newData);
        }
    }
     //ОБНОВЛЕНИЕ
     async function UpdateData() {
        const result = await updateData("http://localhost:5000/detailList/update", {
            id: Number(editId),
            warehouseId: Number(warehouseId),
            detailId: Number(detailId),
            count: Number(count)
            });
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === editId);
                newData[index] = {id: editId, warehouseId: warehouseId, detailId: detailId, count: count};
                setData(newData);
            }
        setEditId(null);
        setModalVisible(false);
        setWarehouseId(0);
        setDetailId(0);
        setCount(0);
                
      }
      function EditData(id){
        const item = data.find(item => item.id === id);
        setEditId(id);
        setModalVisible(true);
        setWarehouseId(item.warehouseId);
        setDetailId(item.detailId);
        setCount(item.count);
    }
    function Cancel(){
        setModalVisible(false);
        setWarehouseId(0);
        setDetailId(0);
        setCount(0);
    }

    return(
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                    <input type={'number'} placeholder='Warehouse ID...' value={warehouseId} onChange={(e) => setWarehouseId(e.target.value)}></input>
                    <input type={'number'} placeholder='Detail Id...' value={detailId} onChange={(e) => setDetailId(e.target.value)}></input>
                    <input type={'number'} placeholder='Count...' value={count} onChange={(e) => setCount(e.target.value)}></input>
                    {!editId ? 
                    <button className={styles.modalAddBtn} onClick={AddData}>Add</button> :
                    <button className={styles.modalAddBtn} onClick={UpdateData}>Update</button>
                    }
                    
                </div>
            </div>
            )}
            <button className={styles.addBtn} onClick={() => setModalVisible(true)}>Add Data</button>
            <div className={styles.cards}>
                        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No detail found</span>) : 
                            data.map((item) => {
                                return (
                                    <div key={item.id} className={styles.card} style={{height: "30vh"}}>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.address}>Warehouse ID: {item.warehouseId}</span>
                                            <span className={styles.address}>Detail Id: {item.detailId}</span>
                                            <span className={styles.address}>Count: {item.count}</span>
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

export default DetailList;