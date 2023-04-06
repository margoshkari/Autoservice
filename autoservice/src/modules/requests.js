async function getAllData(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Origin': 'http://localhost:3000'
        },
        mode: 'cors'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return null;
    };
  };
//ДОБАВЛЕНИЕ
async function addData(url, object){
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
async function removeData(url){
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
async function updateData(url, object) {
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
    getAllData,
    addData,
    removeData,
    updateData
  };