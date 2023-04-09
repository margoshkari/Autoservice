import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';

function Technician(){
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({name: '', phone: '', specialization: '', startWork: '',startWorkInCompany: ''});
    const [modalVisible, setModalVisible] = useState(false);
    const [filterName, setFilterName] = useState('');
    const isMountedRef = useRef(false);
    const [validity, setValidity] = useState({
        name: true,
        phone: true,
        specialization: true,
        startWork: true,
        startWorkInCompany: true,
      });

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetData();
        isMountedRef.current = true;
    }, [])
    //ПОЛУЧЕНИЕ
    async function GetData(){
        const result = await getAllData("http://localhost:5000/technician");
        setData(result);
    };
     //ДОБАВЛЕНИЕ
     async function AddNewData(){
        setValidity({name: true, phone: true, specialization: true, startWork: true, startWorkInCompany: true});
        if(validate()){
            const { name, phone, specialization, startWork,startWorkInCompany } = editData;
            const result = await addData("http://localhost:5000/technician/create", {name, phone, specialization, startWork,startWorkInCompany});
                setData([...data, result])
                setModalVisible(false);
                setEditData({name: '', phone: '', specialization: '', startWork: '',startWorkInCompany: ''});
        }
    }
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`http://localhost:5000/technician/delete/${id}`);
        if(result){
            const newData = data.filter(item => item.id !== id);
            setData(newData);
        }
    }
    //ОБНОВЛЕНИЕ
    async function UpdateData() {
        setValidity({name: true, phone: true, specialization: true, startWork: true, startWorkInCompany: true});
        if(validate()){
            const {id, name, phone, specialization, startWork,startWorkInCompany} = editData;
            const result = await updateData("http://localhost:5000/technician/update", {id: Number(id), name, phone, specialization, startWork,startWorkInCompany});
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
      }
      function EditData(item){
        setEditData(item);
        setModalVisible(true);
        setValidity({name: true, phone: true, specialization: true, startWork: true, startWorkInCompany: true});
    }
    function Cancel(){
        setModalVisible(false);
        setEditData({name: '', phone: '', specialization: '', startWork: '',startWorkInCompany: ''});
    }
    function validate() {
        let isValid = true;
        const phoneRegex = /^\+?\d{1,3}[- ]?\d{1,10}$/;
        const startWorkDate = new Date(editData.startWork);
        const startWorkICompanyDate = new Date(editData.startWorkInCompany);
        const today = new Date();
        let dateInMilliseconds = today - startWorkDate;
        let dateInYears = dateInMilliseconds / (1000 * 60 * 60 * 24 * 365);
        if (!editData.name) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, name: false }));
        }
        if(!phoneRegex.test(editData.phone)){
            isValid = false;
            setValidity((prevValidity) => ({ ...prevValidity, phone: false }));
        }
        if (!editData.specialization) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, specialization: false }));
        }
        if(startWorkDate > today || !editData.startWork || dateInYears > 80){
            isValid = false;
            setValidity((prevValidity) => ({ ...prevValidity, startWork: false }));
        }

        dateInMilliseconds = today - startWorkICompanyDate;
        dateInYears = dateInMilliseconds / (1000 * 60 * 60 * 24 * 365);

        if(startWorkICompanyDate > today || !editData.startWorkInCompany || dateInYears > 80){
            isValid = false;
            setValidity((prevValidity) => ({ ...prevValidity, startWorkInCompany: false }));
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
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}></input>
                
                <input placeholder='Phone...' value={editData.phone}
                className={!validity.phone ? styles.invalid : ''} 
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}></input>
                
                <input placeholder='Specialization...' value={editData.specialization} 
                className={!validity.specialization ? styles.invalid : ''} 
                onChange={(e) => setEditData({ ...editData, specialization: e.target.value })}></input>
                
                <input type={'date'} placeholder='Start Work...' value={editData.startWork} 
                className={!validity.startWork ? styles.invalid : ''} 
                onChange={(e) => setEditData({ ...editData, startWork: e.target.value })}></input>
                
                <input type={'date'} placeholder='Star Work In Company...' value={editData.startWorkInCompany} 
                className={!validity.startWorkInCompany ? styles.invalid : ''}  
                onChange={(e) => setEditData({ ...editData, startWorkInCompany: e.target.value })}></input>
                
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

        <button className={styles.addBtn} onClick={() => {
                setModalVisible(true);
                setValidity({name: true, phone: true, specialization: true, startWork: true, startWorkInCompany: true});
                }}>Add Data</button>

        <div className={styles.cards}>
        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No technician found</span>) : 
                        data.filter((item) => item.specialization.toLowerCase().includes(filterName.toLowerCase())).map((item) => {
                            return (
                                <div key={item.id} className={styles.card} style={{height: "35vh", width: "15%"}}>
                                    <div className={styles.cardInfo}>
                                        <span className={styles.name}>{item.name}</span>
                                        <span className={styles.address}>{item.phone}</span>
                                        <span className={styles.address}>{item.specialization}</span>
                                        <span className={styles.address}>{item.startWork}</span>
                                        <span className={styles.address}>{item.startWorkInCompany}</span>
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