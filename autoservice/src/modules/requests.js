//ПОЛУЧЕНИЕ ДАННЫХ
async function GetAllData(url){
    try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        const data = await response.json();
        return data;
      } catch (error) {
        console.error(error);
        return null;
      }
}
//ДОБАВЛЕНИЕ
async function AddData(url, object){
    try {
        const response = await fetch(url,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }       
}
//УДАЛЕНИЕ
async function RemoveData(url){
    try {
        const response = await fetch(url,
            {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
            });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        return null;
    } 
}
//ОБНОВЛЕНИЕ
async function UpdateData(url, object) {
    try {
        const response = await fetch(url,
            {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(object)
            });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error(error);
        return null;
    }     
  }
export {
    GetAllData,
    AddData,
    RemoveData,
    UpdateData
  };