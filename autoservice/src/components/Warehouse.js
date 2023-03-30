import {useState} from 'react';
import styles from '../styles/WarehouseModule.module.css'

function Warehouse(){
    const [data, setData] = useState([{id: 1, name: "Sklad", address: "Address"}]);
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');

    //УДАЛЕНИЕ
    function RemoveData(id){
        const newData = data.filter(item => item.id !== id);
        setData(newData);
    }
    //ДОБАВЛЕНИЕ
    function AddData(){
        if(name.length > 0 && address.length > 0){
            const newData = {id: data.length + 1, name: name, address: address};
            setData([...data, newData]);
            setModalVisible(false);
            setName('');
            setAddress('');
        }
        else{
            Cancel();
        }
    }
    function Cancel(){
        setModalVisible(false);
        setName('');
        setAddress('');
    }
    return (
        <div>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                    <input placeholder='Name...' value={name} onChange={(e) => setName(e.target.value)}></input>
                    <input placeholder='Address...' value={address} onChange={(e) => setAddress(e.target.value)}></input>
                    <button className={styles.modalAddBtn} onClick={AddData}>Add</button>
                </div>
            </div>
            )}
            <button onClick={() => setModalVisible(true)}>Add Data</button>
            <div className={styles.cards}>
                        {!data ? (<div>No warehouse found</div>) : 
                            data.map((item) => {
                                return (
                                    <div key={item.id} className={styles.card}>
                                        <h2>{item.name}</h2>
                                        <h3>{item.address}</h3>
                                        <button className={styles.removeBtn} onClick={() => RemoveData(item.id)}>Remove</button>
                                    </div>
                                );
                        })}         
                        
            </div>
        </div>
    );
}

export default Warehouse;