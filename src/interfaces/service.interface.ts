import { Model } from "mongoose";

interface Service<T> {
    model: Model<T>;
}

export default Service;
