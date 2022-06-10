import stream from "stream";
import { promisify } from "util";

export const pipeline = promisify(stream.pipeline);
