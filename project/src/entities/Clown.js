import { createEntityClient } from "../utils/entityWrapper";
import schema from "./Clown.json";
export const Clown = createEntityClient("Clown", schema);
