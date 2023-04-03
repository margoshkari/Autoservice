import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'

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
        
            await fetch("/worklist",
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
        await fetch('/worklist/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                description: description,
                price: Number(price),
                duration: Number(duration)
            })
        })
        .then((res) => res.json())
        .then((result) => {
            setData([...data, result]);
        });
        setModalVisible(false);
        setName('');
        setDescription('');
        setPrice(0);
        setDuration(0);
    };
    //УДАЛЕНИЕ
    async function RemoveData(id){
        await fetch(`/worklist/delete/${id}`,
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
                name: name,
                description: description,
                price: Number(price),
                cduration: Number(duration)
            })
        })
        .then((res) => res.json())
        .then((result) => 
        {
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === editId);
                newData[index] = {id: editId, name: name, description: description, price: Number(price), duration: Number(duration)};
                setData(newData);
            }
        }
        )
        .catch(error => {
            console.log(error)
        })
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