
import Mongoose from 'mongoose';

import Task from './models/Task';


export default [
    {
        method: 'GET',
        path: '/tasks/{parent_id?}',
        handler: handleTasksGET,
    },
    {
        method: 'POST',
        path: '/tasks',
        handler: handleTasksPOST,
    },
    {
        method: 'PUT',
        path: '/tasks',
        handler: handleTasksPUT,
    },
    {
        method: 'DELETE',
        path: '/tasks',
        handler: handleTasksDELETE,
    },
];

async function handleTasksGET(request, h) {
    try {
        let parent = null;
        if (request.params.parent_id)
            parent = Mongoose.Types.ObjectId(request.params.parent_id);
        return await Task.find({parent: parent});
    } catch (err) {
        console.log("Error getting tasks: ", err);
        return err;
    }
}

async function handleTasksPOST(request, h) {
    // check for request.payload.text
    const task = new Task({
        text: request.payload.text,
        parent: request.payload.parent || null,
        checked: false,
        createdAt: new Date(),
    });
    try {
        await task.save();
        console.log("saved task: ", task);
        return h.response(task.id).code(201);
    } catch (err) {
        console.log("Error saving task: ", err);
        return err;
    }
}

async function handleTasksPUT(request, h) {
    try {
        const newFields = {checked: request.payload.checked};
        if (request.payload.text)
            newFields.text = request.payload.text;
        await Task.update({_id: request.payload.id},
                          {$set: newFields});
        return h.response().code(204);
    } catch (err) {
        console.log("Error checking task: ", err);
        return err;
    }
}

async function handleTasksDELETE(request, h) {
    try {
        await doTasksDELETE(Mongoose.Types.ObjectId(request.payload.id));
        return h.response().code(204);
    } catch (err) {
        console.log("Error checking task: ", err);
        return err;
    }
}

async function doTasksDELETE(id) {
    try {
        const children = await Task.find({parent: id});
        const childrenPromises = children.map((child) => {
            return doTasksDELETE(child._id);
        });
        await Promise.all(childrenPromises);
        await Task.remove({_id: id});
    } catch (err) {
        throw err;
    }
}
