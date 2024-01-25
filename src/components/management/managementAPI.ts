import axios from "axios"
import { TargetServer } from "../settings/settings"
import { Message } from "../../Message";


// Products
export function getAllProducts(token:string) {
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.get(`${TargetServer}productslist/`,{
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    })
}

export async function addAdminCategory(details:{formData:FormData, token:string}) {
    const token = details.token
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.post(`${TargetServer}pmanagement/`,details.formData,{
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.message,"error")
        throw error;
    });
}

export async function removeAdminCategory(details:{formData:FormData, token:string}) {
    const token = details.token
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.post(`${TargetServer}pmanagement/`,details.formData,{
        headers: {
            Authorization: `Bearer ${token}`
        },
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        Message(error.response.data.message,"error")
        throw error;
    });
}

export async function addAdminProducts(details:{formData:FormData, token:string}) {

    const token = details.token
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.post(`${TargetServer}pmanagement/`,details.formData,{
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

export async function editAdminProducts(details:{formData:FormData, token:string, productid:number}) {
    const token = details.token
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.put(`${TargetServer}pmanagement/${details.productid}/`,details.formData,{
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

export async function removeAdminProducts(details:{productid:number, token:string}) {
    const token = details.token
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.delete(`${TargetServer}pmanagement/${details.productid}/`,{
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
// End Products

// Customers
export function getAllCustomers(token:string) {
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.get(`${TargetServer}umanagement/`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

export async function editAdminStaff(details:{userid:number, set:boolean, token:string}) {
    const token = details.token
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.put(`${TargetServer}umanagement/set/`,details,{
        headers: {
            Authorization: `Bearer ${token}`,
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


export async function admin_removeuser(details:{userid:number, token:string}) {
    const token = details.token
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.delete(`${TargetServer}umanagement/delete/${details.userid}/`,{
        headers: {
            Authorization: `Bearer ${token}`,
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

export function admin_getuserreceipts(details:{userid:number,token:string}) {
    const token = details.token
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.get(`${TargetServer}/umanagement/receipts/${details.userid}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}

// End Customers

// Receipts

export function admin_getallreceipts(token:string){
    if(!token || token === ""){
        return {data:{state:"error","message":"User not found, Relog and try Again."}}
    }
    return axios.get(`${TargetServer}/getreceipts`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
}