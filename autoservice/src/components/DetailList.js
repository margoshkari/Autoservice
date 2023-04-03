import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'

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
        
            await fetch("/detailList",
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
            .catch ((error)=> {
                console.error(error)});
    }
    //ДОБАВЛЕНИЕ
    async function AddData(){
        await fetch('/detailList/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                warehouseId: Number(warehouseId),
                detailId: Number(detailId),
                count: Number(count)
            })
        })
        .then((res) => res.json())
        .then((result) => {
            setData([...data, result]);
        });
        setModalVisible(false);
        setWarehouseId(0);
        setDetailId(0);
        setCount(0);
    };
     //ОБНОВЛЕНИЕ
     async function UpdateData() {
        await fetch(`/detailList/update`,
        {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                id: Number(editId),
                warehouseId: Number(warehouseId),
                detailId: Number(detailId),
                count: Number(count)
            })
        })
        .then((res) => res.json())
        .then((result) => 
        {
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === editId);
                newData[index] = {id: editId, warehouseId: warehouseId, detailId: detailId, count: count};
                setData(newData);
            }
        }
        )
        .catch(error => {
            console.log(error)
        })
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
    //УДАЛЕНИЕ
    async function RemoveData(id){
        await fetch(`/detailList/delete/${id}`,
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