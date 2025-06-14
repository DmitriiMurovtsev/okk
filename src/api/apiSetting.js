import axios from "axios";


// базовая настройка экземпляра axios
const api = axios.create({
    baseURL: 'https://app.insfamily.ru',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,    
});


async function setupInterceptors(navigate) {
    // потеря аутентификации
    api.interceptors.response.use(
        async (response) => { return response},
        async (error) => {
            if (axios.isAxiosError(error) && error.response?.status === 401) {
                window.location.href = 'https://app.insfamily.ru/login/';
            }
            return error.response;
        }
    )
}


export { api, setupInterceptors }
