import { api } from "./apiSetting";


// получение списка полисов для проверки
async function getPolicies(status, pageLink, search) {
    let params = {
        status: status,
        page_size: 10,
    }
    if (search) {
        params['search'] = search
    }
    if (pageLink) {
        const response = await api(pageLink)
        return response
    } else {
        const response = await api('/okk/policies/', {params})
        return response
    }
}

// смена статуса полиса
async function changeStatus(policyId, newStatus) {
    const response = await api.patch(`/okk/policies/${policyId}/`, {status: newStatus})
    return response
}

// создает задачу
async function createTask(policyId) {
    const response = await api.post(`/okk/policies/${policyId}/create_task/`)
    return response
}


export {
    getPolicies,
    changeStatus,
    createTask,
}
