export const isAdmin = (req, res, next) =>{
   
    if(!req.roles){
        return res.status(500).json({
            'Error': 'Se ha intentado validar el rol sin validar el token primero'
        });
    }
   
    const haveRolAdmin = req.roles.some(rol => rol.name === 'admin');

    if(!haveRolAdmin){
        return res.status(401).json({
            'msg': 'No es administrador'
        });
    }
    console.log(req.email + "accediendo como admin...");
    next();
}

export const isStandard = (req, res, next) =>{

    if(!req.roles){
        return res.status(500).json({
            'Error': 'Se ha intentado validar el rol sin validar el token primero'
        });
    }

     const haveRolStandard = req.roles.some(rol => rol.name === 'standard');

    if(!haveRolStandard){
        return res.status(401).json({
            'msg': 'No es standard'
        });
    }
    console.log(req.email + "accediendo como standard...");
    next();
}


//por lo visto para poder hacer una cosa que quiero tengo que implementar esto

export const hasRole = (...allowedRoles) =>{
    return (req, res, next) =>{
        if(!req.roles){
            return res.status(500).json({
                msg:'Se requiere verificar el jwt antes que el rol'
            });
        }

        const isAuthorized = req.roles.some(userRole => allowedRoles.includes(userRole.name));

        if(!isAuthorized){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles: ${allowedRoles.join(', ')}`
            });
        }
        next();
    }
}