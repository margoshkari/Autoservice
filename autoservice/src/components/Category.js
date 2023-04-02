import {useState, useEffect, useRef} from 'react';
import styles from '../styles/CardsModule.module.css'


function Category(){
    const [initialData, setInitialData] = useState([]);
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
        try {
            await fetch("http://localhost:5000/category",
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((res) => res.json())
            .then((data) => {
                setData(data);
                setInitialData(data);
            })
        } catch (error) {
            console.error(error);
        }
    }
    //ПОЛУЧЕНИЕ КАТЕГОРИИ ПО ID
    async function GetById(id){
        try {
            await fetch(`http://localhost:5000/category/${id}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                  },
            })
            .then((res) => res.json())
            .then((data) => setCategory(data))
        } catch (error) {
            console.error(error);
        }
    }
    //ПОЛУЧЕНИЕ НАЗВАНИЯ РОДИТЕЛЬСКОЙ КАТЕГОРИИ
    function GetCategoryNameById(id){
        const index = data.findIndex(item => item.id === Number(id));
        return data[index] ? data[index].name : undefined;
    }
    //ФИЛЬТР КАТЕГОРИЙ ПО РОДИТЕЛЬСКОМУ ID
    async function GetByParentId(id){
        try {
            await fetch(`/category?parentId=${id}`,
            {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                  },
            })
            .then((res) => res.json())
            .then((data) => setData(data))
        } catch (error) {
            console.error(error);
        }
    }
    //ФИЛЬТР ПО НАЗВАНИЮ
    function GetCategoryByName(){
        const tmpData = initialData;
        if(searchName.length > 0){
            const index = tmpData.findIndex(item => item.name == searchName);
            console.log(index)
            if(index !== -1){
                console.log(data);
                const newData = tmpData.filter(item => item.id === tmpData[index].id || Number(item.parentCategory) === tmpData[index].id);
                setData(newData);
                setSearchName('');
            }
            else{
                setData(null);
            }
        }
        else{
            setData(initialData);
        }
    }
    //ДОБАВЛЕНИЕ
    async function AddData(){
        console.log(parentCategory)
        if(name.length > 0 && parentCategory >= 0){
                await fetch(`http://localhost:5000/category/create`,
                {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        name: name,
                        parentCategory: parentCategory ? parentCategory : null
                    })
                })
                .then((res) => res.json())
                .then((newData) => {
                    setData([...data, newData]);
                    setInitialData([...initialData, newData]);
                })
                .catch(error => {
                    console.log(error)
                })
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
            await fetch(`http://localhost:5000/category/delete/${id}`,
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
                    GetAllData();
                }
            }
            )
            .catch(error => {
                console.log(error)
            })
    }
    //ОБНОВЛЕНИЕ
    async function UpdateData() {
        if(name.length > 0){
                await fetch(`http://localhost:5000/category/update`,
                {
                    method: "PATCH",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ 
                        id: editId,
                        name: name,
                        parentCategory: parentCategory ? parentCategory : null
                    })
                })
                .then((res) => res.json())
                .then((result) => 
                {
                    if(result){
                        const newData = [...data];
                        const index = newData.findIndex(item => item.id === editId);
                        newData[index] = {id: editId, name: name, address: parentCategory};
                        GetAllData();
                    }
                }
                )
                .catch(error => {
                    console.log(error)
                })
            setModalVisible(false);
            setEditId(null);
            setName('');
            setParentCategory('');
        } else {
            Cancel();
        }
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
            <button className={styles.addBtn} onClick={GetCategoryByName}>Search</button>
            </div>
            <button className={styles.addBtn} onClick={() => setModalVisible(true)}>Add Data</button>
            <div className={styles.cards}>
                        {!data ? (<span style={{fontSize: "2rem", margin:"5%"}}>No category found</span>) : 
                            data.map((item) => {
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