
// import { GraphQLDateTime } from 'graphql-iso-date';


const resolvers = (db) => ({
		// DateTime: GraphQLDateTime,
		Query: {
				async getTasks() {
						return await db.Task.find();
				},
				async getTaskById(root, {id}) {
						return await db.Task.findById(id);
				},
		},
		Mutation: {
				async createTask(root, args) {
						const task = new Task({
								text: args.text,
								parent: args.parent || null,
								checked: false,
								createdAt: new Date(),
						});
						try {
								const savedTask = await task.save();
								console.log("saved task: ", task);
								console.log("savedTask: ", savedTask);
								return savedTask;
						} catch (err) {
								console.log("Error saving task: ", err);
								return err;
						}
				}
		}
});

export default resolvers;
