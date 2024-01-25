import axios from 'axios';
import { TargetServer } from '../settings/settings';
import { Message } from '../../Message';
export async function logtoServer(details: { userName: string; password: string; }) {
    const MY_SERVER = `${TargetServer}login/`; // Updated protocol to 'http' or 'https'
    
    const data = {
        "username": details.userName,
        "password": details.password
    }
    return axios.post(MY_SERVER, JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.detail,"error")
        throw error;
    });
}

export async function getClientReceipts(details:{token:string}){

    const token = details.token
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.get(`${TargetServer}/profile/`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

}

export async function updateClientPicture(formData: FormData) {
    const MY_SERVER = `${TargetServer}profile/`; // Updated protocol to 'http' or 'https'
    
    const token = formData.get('token');

    return axios.put(MY_SERVER, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.detail,"error")
        throw error;
    });
}

export async function updateClientName(formData: FormData) {
    const MY_SERVER = `${TargetServer}profile/`; // Updated protocol to 'http' or 'https'
    

    const token = formData.get('token');

    return axios.put(MY_SERVER, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.detail,"error")
        throw error;
    });
}


export async function recommendProduct( token: string) {
    const MY_SERVER = `${TargetServer}api/recommend_recipes/`; // Updated protocol to 'http' or 'https'
    
    return axios.post(MY_SERVER, {}, {
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.detail,"error")
        throw error;
    });
}
