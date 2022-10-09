import express  from "express";
import dotenv from 'dotenv';
import conectarDB from "./config/db.js";
import veterinariaRoutes from "./routes/VeterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";

const app = express();
app.use(express.json());
dotenv.config();

conectarDB();



app.use("/api/veterinarios", veterinariaRoutes );
app.use("/api/pacientes", pacienteRoutes );
   


const PORT = process.env.PORT || 4000;

app.listen(4000, () => {
console.log(`servidor funcionando en el puerto ${PORT}`);
});