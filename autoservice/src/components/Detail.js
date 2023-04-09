import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';

function Detail(){
    const [filterModel, setFilterModel] = useState('');
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({model: '', vendorCode: '', description: '', compatibleVehicles: '', catId: 0});
    const [modalVisible, setModalVisible] = useState(false);
    const isMountedRef = useRef(false);
    const [validity, setValidity] = useState({
        model: true,
        vendorCode: true,
        description: true,
        compatibleVehicles: true,
        catId: true,
      });

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetAllData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ ДЕТАЛЕЙ
    async function GetAllData(){
        const result = await getAllData("/detail");
        setData(result);
    }
    //ДОБАВЛЕНИЕ
    async function AddData(){
        setValidity({model: true, vendorCode: true,description: true,compatibleVehicles: true,catId: true})
        if(validate()){
            const {model, vendorCode, description, compatibleVehicles, catId} = editData;
            const result = await addData("/detail/create", {
                model: model,
                vendorCode: vendorCode,
                description: description,
                compatibleVehicles: compatibleVehicles,
                catId: Number(catId)
                });
                setData([...data, result]);
            setModalVisible(false);
            setEditData({model: '', vendorCode: '', description: '', compatibleVehicles: '', catId: 0});
        }
    };
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`/detail/delete/${id}`);
        if(result){
            const newData = data.filter(item => item.id !== id);
            setData(newData);
        }
    }
    //ОБНОВЛЕНИЕ
    async function UpdateData() {
        setValidity({model: true, vendorCode: true,description: true,compatibleVehicles: true,catId: true})
        if(validate()){
            const {id, model, vendorCode, description, compatibleVehicles, catId} = editData;
            const result = await updateData("/detail/update", {
                id: Number(id),
                model: model,
                vendorCode: vendorCode,
                description: description,
                compatibleVehicles: compatibleVehicles,
                catId: Number(catId)
                });
                if(result){
                    const newData = [...data];
                    const index = newData.findIndex(item => item.id === Number(id));
                    newData[index] = {id: Number(id), model: model, vendorCode: vendorCode, description: description, compatibleVehicles: compatibleVehicles, catId: Number(catId)};
                    setData(newData);
                }
            setModalVisible(false);
            setEditData({model: '', vendorCode: '', description: '', compatibleVehicles: '', catId: 0});
        }    
      }
      function EditData(item){
        setModalVisible(true);
        setEditData(item);
        setValidity({model: true, vendorCode: true,description: true,compatibleVehicles: true,catId: true})
      }
    function Cancel(){
        setModalVisible(false);
        setEditData({model: '', vendorCode: '', description: '', compatibleVehicles: '', catId: 0});
    }
    function validate() {
        let isValid = true;
        if (!editData.model) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, model: false }));
        }
        if(!editData.vendorCode){
            isValid = false;
            setValidity((prevValidity) => ({ ...prevValidity, vendorCode: false }));
        }
        if(!editData.description){
            isValid = false;
            setValidity((prevValidity) => ({ ...prevValidity, description: false }));
        }
        if(!editData.compatibleVehicles){
            isValid = false;
            setValidity((prevValidity) => ({ ...prevValidity, compatibleVehicles: false }));
        }
        if(!editData.catId || editData.catId < 1){
            isValid = false;
            setValidity((prevValidity) => ({ ...prevValidity, catId: false }));
        }
        return isValid;
      }
    return(
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>

                    <input placeholder='Model...' value={editData.model} 
                    className={!validity.model ? styles.invalid : ''}
                    onChange={(e) => setEditData({...editData, model: e.target.value})}></input>

                    <input placeholder='Vendor Code...' value={editData.vendorCode} 
                    className={!validity.vendorCode ? styles.invalid : ''}
                    onChange={(e) => setEditData({...editData, vendorCode: e.target.value})}></input>

                    <input placeholder='Description...' value={editData.description}
                    className={!validity.description ? styles.invalid : ''} 
                    onChange={(e) => setEditData({...editData, description: e.target.value})}></input>

                    <input placeholder='Compatible Vehicles...' value={editData.compatibleVehicles} 
                    className={!validity.compatibleVehicles ? styles.invalid : ''} 
                    onChange={(e) => setEditData({...editData, compatibleVehicles: e.target.value})}></input>

                    <input type={'number'} placeholder='Category ID...' value={editData.catId} 
                    className={!validity.catId ? styles.invalid : ''} 
                    onChange={(e) => setEditData({...editData, catId: e.target.value})}></input>

                    {!editData.id ? 
                    <button className={styles.modalAddBtn} onClick={AddData}>Add</button> :
                    <button className={styles.modalAddBtn} onClick={UpdateData}>Update</button>
                    }
                    
                </div>
            </div>
            )}
            <div>
                <input className={styles.search} placeholder='Model...' value={filterModel} onChange={(e) => setFilterModel(e.target.value)}></input>
            </div>
            <button className={styles.addBtn} onClick={() => {
                setModalVisible(true);
                setValidity({model: true, vendorCode: true,description: true,compatibleVehicles: true,catId: true});
                }}>Add Data</button>
            <div className={styles.cards}>
                        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No detail found</span>) : 
                            data.filter((item) => item.model.toLowerCase().includes(filterModel.toLowerCase())).map((item) => {
                                return (
                                    <div key={item.id} className={styles.card} style={{height: "35vh", width: "15%"}}>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.name}>{item.model}</span>
                                            <div className={styles.info}>
                                                <span className={styles.address}>Vendor code: {item.vendorCode}</span>
                                                <span className={styles.address}>{item.description}</span>
                                                <span className={styles.address}>Compatible Vehicles: {item.compatibleVehicles}</span>
                                                <span className={styles.address}>Category id: {item.catId}</span>
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
export default Detail;