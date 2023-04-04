import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';

function WorkList(){
    const [filterName, setFilterName] = useState('');
    const [data, setData] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [duration, setDuration] = useState(0);
    const [editId, setEditId] = useState(null);
    const isMountedRef = useRef(false);

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetAllData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ УСЛУГ
    async function GetAllData(){
        const result = await getAllData("http://localhost:5000/worklist");
        setData(result);
    }
    //ДОБАВЛЕНИЕ
    async function AddData(){
        const result = await addData("http://localhost:5000/worklist/create", {
            name: name,
            description: description,
            price: Number(price),
            duration: Number(duration)
            });
        setData([...data, result]);
        setModalVisible(false);
        setName('');
        setDescription('');
        setPrice(0);
        setDuration(0);
    };
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`http://localhost:5000/worklist/delete/${id}`);
        if(result){
            const newData = data.filter(item => item.id !== id);
            setData(newData);
        }
    }
    //ОБНОВЛЕНИЕ
    async function UpdateData() {
        const result = await updateData("http://localhost:5000/worklist/update", {
                id: Number(editId),
                name: name,
                description: description,
                price: Number(price),
                cduration: Number(duration)
            });
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === editId);
                newData[index] = {id: editId, name: name, description: description, price: Number(price), duration: Number(duration)};
                setData(newData);
            }
        setModalVisible(false);
        setEditId(null);
        setName('');
        setDescription('');
        setPrice(0);
        setDuration(0);
                
      }
      function EditData(id){
        const item = data.find(item => item.id === id);
        setModalVisible(true);
        setEditId(item.id);
        setName(item.name);
        setDescription(item.description);
        setPrice(item.price);
        setDuration(item.duration);
    }
    function Cancel(){
        setModalVisible(false);
        setName('');
        setDescription('');
        setPrice(0);
        setDuration(0);
    }
    return(
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                    <input placeholder='Name...' value={name} onChange={(e) => setName(e.target.value)}></input>
                    <input placeholder='Description...' value={description} onChange={(e) => setDescription(e.target.value)}></input>
                    <input type={'number'} placeholder='Price...' value={price} onChange={(e) => setPrice(e.target.value)}></input>
                    <input type={'number'} placeholder='Duration...' value={duration} onChange={(e) => setDuration(e.target.value)}></input>
                    {!editId ? 
                    <button className={styles.modalAddBtn} onClick={AddData}>Add</button> :
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
                        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No detail found</span>) : 
                            data.filter((item) => item.name.toLowerCase().includes(filterName.toLowerCase())).map((item) => {
                                return (
                                    <div key={item.id} className={styles.card} style={{height: "25vh"}}>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.name}>{item.name}</span>
                                            <span className={styles.address}>{item.description}</span>
                                            <span className={styles.address}>{item.price}</span>
                                            <span className={styles.address}>{item.duration}</span>
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

export default WorkList;