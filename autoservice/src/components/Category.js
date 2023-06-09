import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';


function Category(){
    const [data, setData] = useState([]);
    const [editData, setEditData] = useState({name: '', parentCategory: undefined});
    const [category, setCategory] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [searchName, setSearchName] = useState('');
    const isMountedRef = useRef(false);
    const [validity, setValidity] = useState({
        name: true,
        parentCategory: true,
      });

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetAllData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ КАТЕГОРИЙ
    async function GetAllData(){
        const result = await getAllData("/category");
        setData(result);
    }
    //ПОЛУЧЕНИЕ КАТЕГОРИИ ПО ID
    async function GetById(id){
        
            await fetch(`/category/${id}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                  },
            })
            .then((res) => res.json())
            .then((data) => setCategory(data))
            .catch ((error)=> {
                console.error(error)});
    }
    //ПОЛУЧЕНИЕ НАЗВАНИЯ РОДИТЕЛЬСКОЙ КАТЕГОРИИ
    function GetCategoryNameById(id){
        const index = data.findIndex(item => item.id === Number(id));
        return data[index] ? data[index].name : undefined;
    }
    //ФИЛЬТР КАТЕГОРИЙ ПО РОДИТЕЛЬСКОМУ ID
    async function GetByParentId(id){
        
            await fetch(`/category?parentId=${id}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                  },
            })
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch ((error)=> {
                console.error(error)});
    }
    //ДОБАВЛЕНИЕ
    async function AddData(){
        setValidity({name: true, parentCategory: true});
        if(validate()){
            const {name, parentCategory} = editData;
            const result = await addData("/category/create", {
                name: name, 
                parentCategory: parentCategory ? Number(parentCategory) : null
            });
            setData([...data, result])
            setModalVisible(false);
            setEditData({ name: '', parentCategory: undefined });
        }
    }
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`/category/delete/${id}`);
        if(result){
            setData(removeChildren(data, id));
        }
    }
    const removeChildren = (data, parentId) => {
        const children = data.filter(item => item.parentCategory === parentId);
        children.forEach(item => {
            removeChildren(data, item.id);
        });
        const newData = data.filter(item => item.id !== parentId && !children.includes(item));
        return newData;
      };
    //ОБНОВЛЕНИЕ
    async function UpdateData() {
        setValidity({name: true, parentCategory: true});
        if(validate()){
            const {id, name, parentCategory} = editData;
            const result = await updateData("/category/update", {
                id: Number(id),
                name: name, 
                parentCategory: parentCategory ? Number(parentCategory) : null
            });
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === Number(id));
                newData[index] = {id: Number(id), name: name, address: parentCategory};
                GetAllData();
            }
            setModalVisible(false);
            setEditData({ name: '', parentCategory: undefined }); 
        }
      }
      function EditData(item){
        setEditData(item); 
        setModalVisible(true);
        setValidity({name: true, parentCategory: true});    
    }
    function Cancel(){
        setModalVisible(false);
        setEditData({ name: '', parentCategory: null }); 
    }
    function validate() {
        let isValid = true;
        if (!editData.name) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, name: false }));
        }
        if(!editData.parentCategory){
            setValidity((prevValidity) => ({ ...prevValidity, parentCategory: true }));
        }
        else if (editData.parentCategory < 1 || !data.some(item => item.id == editData.parentCategory)) {
          isValid = false;
          setValidity((prevValidity) => ({ ...prevValidity, parentCategory: false }));
        }
        return isValid;
      }
    return (
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>

                    <input placeholder='Name...' value={editData.name} 
                    className={!validity.name ? styles.invalid : ''}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}></input>

                    <input type={'number'} placeholder='Parent Category ID...' value={editData.parentCategory} 
                    className={!validity.parentCategory ? styles.invalid : ''}
                    onChange={(e) => setEditData({ ...editData, parentCategory: e.target.value })}></input>

                    {!editData.id ? 
                    <button className={styles.modalAddBtn} onClick={AddData}>Add</button> :
                    <button className={styles.modalAddBtn} onClick={UpdateData}>Update</button>
                    }
                    
                </div>
            </div>
            )}
            <div>
                <input className={styles.search} placeholder='Name...' value={searchName} onChange={(e) => setSearchName(e.target.value)}></input>
            </div>
            <button className={styles.addBtn} onClick={() => {
                setModalVisible(true);
                setValidity({name: true, parentCategory: true})
                }}>Add Data</button>
            <div className={styles.cards}>
                        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No category found</span>) : 
                            data.filter((item) => item.name.toLowerCase().includes(searchName.toLowerCase())).map((item) => {
                                return (
                                    <div key={item.id} className={styles.card}>
                                        <div className={styles.cardInfo}>
                                            <span className={styles.name}>{item.name}</span>
                                            {item.parentCategory ? <span className={styles.address}>{GetCategoryNameById(item.parentCategory) ? <span>Parent: {GetCategoryNameById(item.parentCategory)}</span> : <span className={styles.empty}></span>}</span> : <span className={styles.empty}></span>}
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

export default Category;