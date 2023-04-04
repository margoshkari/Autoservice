import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'
import {getAllData, addData, removeData, updateData} from '../modules/requests';


function Category(){
    const [data, setData] = useState([]);
    const [category, setCategory] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [searchName, setSearchName] = useState('');
    const [parentCategory, setParentCategory] = useState(0);
    const [editId, setEditId] = useState(null);
    const isMountedRef = useRef(false);

    useEffect(() => {
        if (isMountedRef.current) {
            return;
        }
        GetAllData();
        isMountedRef.current = true;
    }, [])

    //ПОЛУЧЕНИЕ ВСЕХ КАТЕГОРИЙ
    async function GetAllData(){
        const result = await getAllData("http://localhost:5000/category");
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
        if(name.length > 0 && parentCategory >= 0){
            const result = await addData("http://localhost:5000/category/create", {
                name: name, 
                parentCategory: parentCategory ? Number(parentCategory) : null
            });
            setData([...data, result])
            setModalVisible(false);
            setName('');
            setParentCategory('');
        }
        else{
            Cancel();
        }
    }
    //УДАЛЕНИЕ
    async function RemoveData(id){
        const result = await removeData(`http://localhost:5000/category/delete/${id}`);
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
        if(name.length > 0){
            const result = await updateData("http://localhost:5000/category/update", {
                id: editId,
                name: name, 
                parentCategory: parentCategory ? Number(parentCategory) : null
            });
            if(result){
                const newData = [...data];
                const index = newData.findIndex(item => item.id === editId);
                newData[index] = {id: editId, name: name, address: parentCategory};
                GetAllData();
            }
        }
        else{
            Cancel();
        }
        setModalVisible(false);
        setEditId(null);
        setName('');
        setParentCategory(null);    
      }
      function EditData(id){
        const item = data.find(item => item.id === id);
        setName(item.name);
        setParentCategory(item.address);
        setEditId(item.id);
        setModalVisible(true);
    }
    function Cancel(){
        setModalVisible(false);
        setName('');
        setParentCategory('');
    }
    return (
        <div className={styles.content}>
            {modalVisible && (
            <div className={styles.modal}>
                <div className={styles.modalBlock}>
                    <button className={styles.cancelBtn} onClick={Cancel}>X</button>
                    <input placeholder='Name...' value={name} onChange={(e) => setName(e.target.value)}></input>
                    <input type={'number'} placeholder='Parent Category ID...' value={parentCategory} onChange={(e) => setParentCategory(e.target.value)}></input>
                    {!editId ? 
                    <button className={styles.modalAddBtn} onClick={AddData}>Add</button> :
                    <button className={styles.modalAddBtn} onClick={UpdateData}>Update</button>
                    }
                    
                </div>
            </div>
            )}
            <div>
                <input className={styles.search} placeholder='Name...' value={searchName} onChange={(e) => setSearchName(e.target.value)}></input>
            </div>
            <button className={styles.addBtn} onClick={() => setModalVisible(true)}>Add Data</button>
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
                                        <button className={styles.updateBtn} onClick={() => EditData(item.id)}>Update</button>
                                    </div>
                                );
                        })}    
            </div>
        </div>
    );
}

export default Category;