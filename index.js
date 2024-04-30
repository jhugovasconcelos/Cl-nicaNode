import express from "express";
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const filePath = './db.json';
const crud = {
    doctors: [],
    readDoctorFromDb(){
        crud.doctors = fs.readFileSync(filePath, {encoding: 'utf8'});
        return JSON.parse(crud.doctors);
    },
    addDoctorToDb(doctor){
        crud.doctors.push(doctor);
        fs.writeFileSync(filePath, JSON.stringify(crud.doctors), {encoding: 'utf8'});
    },
    filterByName(arr, doctorName){
        return arr.nome === doctorName       
    }
};



app.listen(PORT, () => console.log(`Servidor executando em: http://localhost:${PORT}`));

app.get("/api/doctors", (req, res) => {
    const doctors = crud.readDoctorFromDb();
    res.send(doctors);
});

app.get("/api/buscanome/:nome", (req, res) => {
    const doctors = crud.readDoctorFromDb();
    const doctor = doctors.find(d => d.nome === req.params.nome);
    if (!doctor) return res.status(404).send('O médico não foi encontrado');
    res.send(doctor);
});

app.get("/api/buscaesp/:especialidades", (req, res) => {
    const doctors = crud.readDoctorFromDb();
    let especialidades = [];
    const doctor = doctors.find(d => d.especialidade === req.params.especialidade);
    if (!doctor) return res.status(404).send('O médico não foi encontrado');
    especialidades.push(doctor);
    res.send(especialidades);
});

app.get("/api/doctors/:id", (req, res) => {
    const doctors = crud.readDoctorFromDb();
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    if (!doctor) return res.status(404).send('O médico não foi encontrado');
    res.send(doctor);
});


app.post("/api/doctors", (req, res) => {
    const doctors = crud.readDoctorFromDb();
    const doctor = {
        id: doctors.length + 1,
        nome: req.body.nome, 
        especialidade: req.body.especialidade,
        planos: req.body.planos,
        valorConsulta: req.body.valorConsulta
    };
    crud.addDoctorToDb(doctor);
    res.send(doctor)
});

app.put('/api/doctors/:id', (req, res) => {
    // procurar o doutor
    const doctors = crud.readDoctorFromDb();
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    // se não tiver, retornar 404
    if (!doctor) return res.status(404).send('O médico não foi encontrado');
    
    // Pegando os valores da requisição
    const valorAMudar = req.body;

    // Checando quais campos estão presentes no corpo
    const valoresMudados = Object.keys(valorAMudar)
    .filter(key => doctor.hasOwnProperty(key));

    // Atualizando os campos
    valoresMudados.forEach(campo => {
        doctor[campo] = valorAMudar[campo];
    });

    // Retornando o doutor atualizado
    res.send(doctor);
});

app.delete("/api/doctors/:id", (req, res) => {
    // procurar o doutor
    const doctors = crud.readDoctorFromDb();
    const doctor = doctors.find(d => d.id === parseInt(req.params.id));
    // se não tiver, retornar 404
    if (!doctor) return res.status(404).send('O médico não foi encontrado');
    
    // deletar o doutor do array
    const index = doctors.indexOf(doctor);
    doctors.splice(index, 1);

    // enviar a resposta ao cliente
    res.send('O registro do médico foi apagado')
    
});
