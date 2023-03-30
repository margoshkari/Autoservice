import {useState} from 'react';
import styles from '../styles/WarehouseModule.module.css'

function Warehouse(){
    const [data, SetData] = useState([{id: 1, name: "Sklad", address: "Address"}]);

    //УДАЛЕНИЕ
    function RemoveData(id){
        const newData = data.filter(item => item.id !== id);
        SetData(newData);
    }
    return (
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
    );
}

export default Warehouse;