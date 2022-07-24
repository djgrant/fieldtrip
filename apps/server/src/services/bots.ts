import { createBot } from "./bot";
import { enrollments, db} from "../services/db";

export const fieldtrip = createBot("fieldtrip",(app)=> {
    app.on("repository.deleted", async()=> {
     await enrollments(db).delete({username:'alaa-yahia',course_id: 'js2'})
})});

export const malachi = createBot("malachi");
export const uma = createBot("uma");
export const amber = createBot("amber");
