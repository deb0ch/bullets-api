
import Mongoose from 'mongoose';


const Schema = Mongoose.Schema;

const TaskSchema = new Schema({
    text: String,
    parent: Mongoose.Schema.Types.ObjectId,
    checked: Boolean,
    createdAt: Date,
});

export default Mongoose.model('Task', TaskSchema);
