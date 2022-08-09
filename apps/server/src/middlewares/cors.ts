import corsFactory from "cors";
import { CLIENT_HOST } from "src/config";

export const cors = corsFactory({
  origin: CLIENT_HOST,
  credentials: true,
});
