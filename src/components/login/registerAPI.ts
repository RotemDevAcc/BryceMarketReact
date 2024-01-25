import axios from 'axios';
import { TargetServer } from '../settings/settings';
import { Message } from '../../Message';


export async function regtoServer(details: { username: string; firstname: string; lastname: string; password: string; email: string; gender: string; dob: string; }) {
    const MY_SERVER = `${TargetServer}register/`; // Updated protocol to 'http' or 'https'
    const data = {
        "username": details.username,
        "firstname": details.firstname,
        "lastname": details.lastname,
        "password": details.password,
        "email":details.email,
        "gender": details.gender,
        "date": details.dob,
    }
    return axios.post(MY_SERVER, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error while sending data to the server:', error);
        const errormessage = error.response.data.message
        if(errormessage){
            const cleanMessage = errormessage.replace(/[[\]']/g, '');
            Message(cleanMessage,"error")
        }
        throw error;
    });
}