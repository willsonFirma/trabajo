import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarid.js";

const registrar =  async (req, res) =>{
    
   const {email} = req.body;

   //prevenir usuarios duplicados
   const existeUsuario = await Veterinario.findOne({email});

   if(existeUsuario){
    const error = new Error("Usuario ya registrado");
    return res.status(400).json({msg:error.message});
   }

   try {
// guardar nuevo veterinario
const veterinario = new Veterinario(req.body);
const veterinarioGuardado = await veterinario.save();

res.json( veterinarioGuardado);
   }catch (error){
    console.log(error);
   };
    
};

const perfil = (req, res) =>{
    const { veterinario } = req;

    res.json({ Perfil: veterinario});
};

const confirmar =  async (req, res) => {
    const { token } = req.params

    const usuarioConfirmar = await Veterinario.findOne({token});

    if(!usuarioConfirmar){
        const error = new Error("Token no valido");
        return res.status(404).json({ msg: error.message });
        
    }

    try {

        usuarioConfirmar.token = null;
        usuarioConfirmar.confirmado = true,
        await usuarioConfirmar.save();
        res.json({msg: "Usuario confirmado correctamente..."});
    } catch (error) {
        console.log(error)
    }

   
};

const autenticar = async (req, res) => {
    const{email, password  }=req.body;

    //comprobar si el usuario existe
    const usuario = await Veterinario.findOne({email});

    if(!usuario){
        const error = new Error("el usuario no existe");
        return res.status(404).json({msg: error.message });
    }

    //comprobar si el usuario esta confirmado
    if(!usuario.confirmado){
        const error = new Error('Tu cuenta no ha sido confirmada');
        return res.status(403).json({msg: error.message});
    }

    // revisar el password
    if(await usuario.comprobarPassword(password)){
        
      res.json({ token: generarJWT(usuario.id)});
      
    }else{
        const error = new Error('El password es incorrecto');
        return res.status(403).json({msg: error.message});
    }
        
};

const olvidePassword =  async (req, res) => {
    const { email } = req.body;

    const existeVeterinario = await Veterinario.findOne({email});
    if(!existeVeterinario){
        const error = new Error("el usuario no existe");
        return res.status(400).json({ msg: error.message});
    }

    try {
        existeVeterinario.token = generarId();
        await existeVeterinario.save();
        res.json({ msg: "hemos enviado un email con las instrucciones"});
    } catch (error) {
        
    }
};

const comprobarToken = async (req, res) => {
const {token} = req.params;

const tokenValido = await Veterinario.findOne({token});

if(tokenValido){
    //el token es valido el usuario existe
    res.json({msg: "token valido el usuario si existe"});
}else{
    const error= new Error("token no valido");
    return res.status(400).json({msg: error.message});
}
};

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token});
    if(!veterinario){
        const error = new Error("hubo un errro");
        return res.status(400).json({ msg: error.message});
    }

    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();
        res.json({ msg: "passowrd modificado correctamente"});
        
    } catch (error) {
        console.log(error);
    }
};

export {registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword};