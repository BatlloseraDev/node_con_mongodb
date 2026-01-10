import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    idU: {
        type: Number,
        default:null// para cuando se cree y no tenga ningún usuario asignado
    },
    description: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true,
        min:0 //con esto me evito tiempos negativos
    },
    difficulty:{
        type: String,
        enum: ['XS','S','M','L','XL'],
        required: true 
    },
    status:{
        type:String,
        enum:['por hacer', 'haciendo', 'hecha'],
        default:'por hacer'
    }
    
},{
    collection: 'tasks',
    versionKey: false,
    timestamps:true

});

const Task = mongoose.model('Task', taskSchema);

export default Task;