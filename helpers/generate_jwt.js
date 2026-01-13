import jwt from 'jsonwebtoken';
import kleur from 'kleur';

export const generateJWT = (uid = '') => {
    console.log(kleur.bgRed().white().bold('En la generación de JWT, el UID es: ' + uid));
    let token = jwt.sign({ uid }, process.env.SECRETORPRIVATEKEY, {
        expiresIn: '4h'
    });
    return token;
}//generador de token sin roles



export const generateJWT_with_roles = (uid = '', roles = []) => {
    console.log(kleur.bgRed().white().bold('En la generación de JWT, el UID es: ' + uid));
    let token = jwt.sign({ uid, roles }, process.env.SECRETORPRIVATEKEY, {
        expiresIn: '20h'
    });
    console.log(kleur.bgGreen().white().bold('Token generado: ' + token));
    return token;

}//generador de token con roles





