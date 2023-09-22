import { combineReducers } from "redux";
import carritoReducer from "./carrito";

export default combineReducers({
  carrito: carritoReducer,
  // otros reducers...
});