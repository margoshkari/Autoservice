import {useState} from 'react';
import styles from '../styles/WarehouseModule.module.css'

function Warehouse(){
    const [data, SetData] = useState([{id: 1, name: "Sklad", address: "Address"}]);
    return (
        <div>
            {data.map((item) => {
                 return (
                    <div key={item.id} className={styles.card}>
                        <h2>{item.name}</h2>
                        <h3>{item.address}</h3>
                    </div>
                );
            })}
        </div>
    );
}

export default Warehouse;