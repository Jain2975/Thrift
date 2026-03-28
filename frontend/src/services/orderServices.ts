import api from "../api/axios";

export const checkoutOrder = async () => {
  try {
    const response = await api.post("/order");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    } else {
      throw new Error("Could not process checkout");
    }
  }
};
