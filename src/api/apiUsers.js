import { api } from "./apiSetting";


// получает список прав пользователя
async function getPermiss() {
    const response = await api(`/users/get_permiss/`)
    return response
}


export { 
    getPermiss,
 }