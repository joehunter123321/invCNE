const initialState = {
    items: [],
    total: 0
  };
  
  export const addProduct = (product) => ({
    type: "ADD_PRODUCT",
    payload: product
  });
  
  export default (state = initialState, action) => {
    switch (action.type) {
      case "ADD_PRODUCT":
        return {
          ...state,
          items: [state.items, action.payload],
          total: state.total + action.payload.price
        };
      default:
        return state;
    }
  };