import { createBot } from "./bot";
import { enrollments, db} from "../services/db";

export const fieldtrip = createBot("fieldtrip",(app)=> {
    app.on("repository.deleted", async(context)=> {
        const username = context.payload.repository?.owner?.login
        await enrollments(db).delete({username});
})});

export const malachi = createBot("malachi");
export const uma = createBot("uma");
export const amber = createBot("amber");
