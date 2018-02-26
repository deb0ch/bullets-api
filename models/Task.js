
import Mongoose from 'mongoose';


const TaskSchema = new Mongoose.Schema({
    text: String,
    parent: Mongoose.Schema.Types.ObjectId,
    checked: Boolean,
    createdAt: Date,
});

export default Mongoose.model('Task', TaskSchema);
