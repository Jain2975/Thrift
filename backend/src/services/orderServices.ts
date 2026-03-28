import { prisma } from "../db/prisma.ts";

export const createOrderFromCart = async (userId: string) => {
  try {
    const order = await prisma.$transaction(async (tx) => {
      // 1. Fetch the user's cart
      const cart = await tx.cart.findUnique({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
      }

      // 2. Calculate the total price
      const total = cart.items.reduce((sum, item) => {
        return sum + Number(item.product.price) * item.quantity;
      }, 0);

      // 3. Create the Order (status: paid, to mock a successful transaction)
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          status: "paid",
          items: {
            create: cart.items.map((cartItem) => ({
              productId: cartItem.productId,
              quantity: cartItem.quantity,
              price: cartItem.product.price,
            })),
          },
        },
      });

      // 4. Delete the Cart items since order is created
      await tx.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return newOrder;
    });

    return order;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw new Error("Could not mock checkout and create order");
  }
};
