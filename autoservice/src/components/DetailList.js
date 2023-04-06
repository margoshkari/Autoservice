import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';

function DetailList(){
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({warehouseId: 0, detailId: 0, count: 0});
    const [modalVisible, setModalVisible] = useState(false);
    const isMountedRef = useRef(false);

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetAllData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ СПИСКОВ
    async function GetAllData(){
        const result = await getAllData("https://localhost:7083/detailList");
        setData(result);
    }
    //ДОБАВЛЕНИЕ
    async function AddData(){
        const {warehouseId, detailId, count} = editData;
        const result = await addData("https://localhost:7083/detailList/create", {
            warehouseId: Number(warehouseId),
            detailId: Number(detailId),
            count: Number(count)
            });
        setData([...data, result]);
        setModalVisible(false);
        setEditData({warehouseId: 0, detailId: 0, count: 0});
    };
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`https://localhost:7083/detailList/delete/${id}`);
        if(result){
            const newData = data.filter(item => item.id !== id);
            setData(newData);
        }
    }
     //ОБНОВЛЕНИЕ
     async function UpdateData() {
        const {id, warehouseId, detailId, count} = editData;
        const result = await updateData("https://localhost:7083/detailList/update", {
            id: Number(id),
            warehouseId: Number(warehouseId),
            detailId: Number(detailId),
            count: Number(count)
            });
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === Number(id));
                newData[index] = {id: Number(id), warehouseId: warehouseId, detailId: detailId, count: count};
                setData(newData);
            }
        setModalVisible(false);
        setEditData({warehouseId: 0, detailId: 0, count: 0});
                
      }
      function EditData(item){
        setModalVisible(true);
        setEditData(item);
    }
    function Cancel(){
        setModalVisible(false);
        setEditData({warehouseId: 0, detailId: 0, count: 0});
    }

    return(
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                    <input type={'number'} placeholder='Warehouse ID...' value={editData.warehouseId} onChange={(e) => setEditData({...editData, warehouseId: e.target.value})}></input>
                    <input type={'number'} placeholder='Detail Id...' value={editData.detailId} onChange={(e) => setEditData({...editData, detailId: e.target.value})}></input>
                    <input type={'number'} placeholder='Count...' value={editData.count} onChange={(e) => setEditData({...editData, count: e.target.value})}></input>
                    {!editData.id ? 
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
                                        <button className={styles.updateBtn} onClick={() => EditData(item)}>Update</button>
                                    </div>
                                );
                        })}    
            </div>
        </div>
    );
}

export default DetailList;