import { th } from "@faker-js/faker";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleVerify = async (idToken='')=>{
    try{
        if(!idToken){
            throw new Error("El idToken no fue proporcionado");
        }

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        if(!ticket){
            throw new Error("El ticket no fue proporcionado");
        }

        console.log(ticket);

        const payload = ticket.getPayload();
        
        if(!payload){
            throw new Error("El payload no fue proporcionado");
        }
        
        const {name, picture:img, email} = payload;

        return {name, img, email};
    }catch(error){
        console.log('Error en la verificación del token de Google:',error);
        throw new Error(`El token no se pudo verificar: ${error.message}}`);
    
    }
}