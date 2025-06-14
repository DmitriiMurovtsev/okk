import { api } from "./apiSetting";


// удаляет задачу
async function deleteTask(taskId) {
    const response = await api.delete(`/tasks/${taskId}/`)
    return response
}


export { 
    deleteTask,
 }