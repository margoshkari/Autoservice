import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';

function WorkList(){
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({name: '', description: '', price: 0, duration: 0});
    const [modalVisible, setModalVisible] = useState(false);
    const [filterName, setFilterName] = useState('');
    const isMountedRef = useRef(false);
    const [validity, setValidity] = useState({
        name: true,
        description: true,
        price: true,
        duration: true,
      });

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
        setValidity({name: true, description: true, price: true, duration: true});
        if(validate()){
            const {name, description, price, duration} = editData;
            const result = await addData("http://localhost:5000/worklist/create", {
                name: name,
                description: description,
                price: Number(price),
                duration: Number(duration)
                });
            setData([...data, result]);
            setModalVisible(false);
            setEditData({name: '', description: '', price: 0, duration: 0});
        }
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
        setValidity({name: true, description: true, price: true, duration: true});
        if(validate()){
            const {id, name, description, price, duration} = editData;
            const result = await updateData("http://localhost:5000/worklist/update", {
                    id: Number(id),
                    name: name,
                    description: description,
                    price: Number(price),
                    duration: Number(duration)
                });
                if(result){
                    const newData = [...data];
                    const index = newData.findIndex(item => item.id === Number(id));
                    newData[index] = {id: Number(id), name: name, description: description, price: Number(price), duration: Number(duration)};
                    setData(newData);
                }
            setModalVisible(false);
            setEditData({name: '', description: '', price: 0, duration: 0});
        }
      }
      function EditData(item){
        setModalVisible(true);
        setEditData(item);
        setValidity({name: true, description: true, price: true, duration: true});
    }
    function Cancel(){
        setModalVisible(false);
        setEditData({name: '', description: '', price: 0, duration: 0});
    }
    function validate() {
        let isValid = true;
        if (!editData.name) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, name: false }));
        }
        if (!editData.description) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, description: false }));
        }
        if (!editData.price || editData.price < 1) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, price: false }));
        }
        if (!editData.duration || editData.duration < 1) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, duration: false }));
        }
        return isValid;
      }
    return(
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>

                    <input placeholder='Name...' value={editData.name} 
                    className={!validity.name ? styles.invalid : ''}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}></input>
                    
                    <input placeholder='Description...' value={editData.description} 
                    className={!validity.description ? styles.invalid : ''}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}></input>
                    
                    <input type={'number'} placeholder='Price...' value={editData.price} 
                    className={!validity.price ? styles.invalid : ''}
                    onChange={(e) => setEditData({...editData, price: e.target.value})}></input>
                    
                    <input type={'number'} placeholder='Duration...' value={editData.duration} 
                    className={!validity.duration ? styles.invalid : ''}
                    onChange={(e) => setEditData({...editData, duration: e.target.value})}></input>
                    
                    {!editData.id ? 
                    <button className={styles.modalAddBtn} onClick={AddData}>Add</button> :
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
                setValidity({name: true, description: true, price: true, duration: true});
                }}>Add Data</button>

            <div className={styles.cards}>
                        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No detail found</span>) : 
                            data.filter((item) => item.name.toLowerCase().includes(filterName.toLowerCase())).map((item) => {
                                return (
                                    <div key={item.id} className={styles.card} style={{height: "25vh"}}>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.name}>{item.name}</span>
                                            <div className={styles.info}>
                                                <span className={styles.address}>{item.description}</span>
                                                <span className={styles.address}>Price: {item.price}</span>
                                                <span className={styles.address}>Duration: {item.duration}</span>
                                            </div>
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

export default WorkList;