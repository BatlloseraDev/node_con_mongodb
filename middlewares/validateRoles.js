export const isAdmin = (req, res, next) =>{
    if(!req.roles.includes('admin')){
        return res.status(401).json({
            'msg': 'No es administrador'
        });
    }
    console.log(req.email + "accediendo como admin...");
    next();
}

export const isStandard = (req, res, next) =>{
    if(!req.roles.includes('standard')){
        return res.status(401).json({
            'msg': 'No es standard'
        });
    }
    console.log(req.email + "accediendo como standard...");
    next();
}