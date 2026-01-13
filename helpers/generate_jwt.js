import jwt from 'jsonwebtoken';
import kleur from 'kleur';

export const generateJWT = (id = '') => {
    console.log(kleur.bgRed().white().bold('En la generación de JWT, el id es: ' + id));
    let token = jwt.sign({ id }, process.env.SECRETORPRIVATEKEY, {
        expiresIn: '4h'
    });
    return token;
}//generador de token sin roles



export const generateJWT_with_roles = (id = '', roles = []) => {
    console.log(kleur.bgRed().white().bold('En la generación de JWT, el id es: ' + id));
    let token = jwt.sign({ id, roles }, process.env.SECRETORPRIVATEKEY, {
        expiresIn: '20h'
    });
    console.log(kleur.bgGreen().white().bold('Token generado: ' + token));
    return token;

}//generador de token con roles





