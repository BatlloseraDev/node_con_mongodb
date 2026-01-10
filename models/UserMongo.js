import mongoose from "mongoose";


const rolSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        enum: ['admin', 'standard'],
        default: 'standard'
    }

},{_id: false});

const userSchema = new mongoose.Schema({
    //por lo que he visto el campo id no es estrictamente obligatorio
    id:{
        type: Number,
        required: true,
        unique: true,
    },
    userName:{
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password:{
        type: String,
        required: true
    },
    //por lo que he entendido lo puedo crear asi:
    role : [rolSchema]
},{
    collection: 'users',
    versionKey: false,
    timestamps:true,
    strict:true
});

const User = mongoose.model('User', userSchema);

export default User;