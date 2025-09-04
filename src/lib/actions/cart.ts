// "use server";

// import { db } from "@/lib/db";
// import { carts, cartItems } from "@/lib/db/schema/carts";
// import { productVariants } from "@/lib/db/schema/variants";
// import { products } from "@/lib/db/schema/products";
// import { colors } from "@/lib/db/schema/filters/colors";
// import { sizes } from "@/lib/db/schema/filters/sizes";
// import { productImages } from "@/lib/db/schema/images";
// import { guests } from "@/lib/db/schema/guest";
// import { users } from "@/lib/db/schema/user";
// import { eq, and, desc } from "drizzle-orm";
// import { guestSession, getCurrentUser, createGuestSession } from "@/lib/auth/actions";
// import { revalidatePath } from "next/cache";

// export type CartItem = {
//   id: string;
//   productVariantId: string;
//   quantity: number;
//   variant: {
//     id: string;
//     sku: string;
//     price: string;
//     salePrice?: string;
//     product: {
//       id: string;
//       name: string;
//       description: string;
//     };
//     color: {
//       id: string;
//       name: string;
//       hexCode: string;
//     };
//     size: {
//       id: string;
//       name: string;
//     };
//     images: Array<{
//       id: string;
//       url: string;
//       isPrimary: boolean;
//     }>;
//   };
// };

// export type Cart = {
//   id: string;
//   items: CartItem[];
//   total: number;
//   itemCount: number;
// };

// async function getOrCreateCart(): Promise<{ cartId: string; isGuest: boolean }> {
//   const user = await getCurrentUser();
//   const guest = await guestSession();

//   if (user) {
//     // Authenticated user
//     let cart = await db
//       .select()
//       .from(carts)
//       .where(eq(carts.userId, user.id))
//       .limit(1);

//     if (!cart.length) {
//       const newCart = await db
//         .insert(carts)
//         .values({ userId: user.id })
//         .returning({ id: carts.id });
//       return { cartId: newCart[0].id, isGuest: false };
//     }
//     return { cartId: cart[0].id, isGuest: false };
//     } else if (guest.sessionToken) {
//       // Guest user
//       // Check if guest exists in guests table, if not create guest first
//       const guestExists = await db
//         .select()
//         .from(guests)
//         .where(eq(guests.id, guest.sessionToken))
//         .limit(1);

//       // if (!guestExists.length) {
//       //   await db.insert(guests).values({ id: guest.sessionToken });
//       // }

//       let cart = await db
//         .select()
//         .from(carts)
//         .where(eq(carts.guestId, guest.sessionToken))
//         .limit(1);

//       if (!cart.length) {
//         const newCart = await db
//           .insert(carts)
//           .values({ guestId: guest.sessionToken })
//           .returning({ id: carts.id });
//         return { cartId: newCart[0].id, isGuest: true };
//       }
//       return { cartId: cart[0].id, isGuest: true };
//     } else {
//       // No session, create guest session
//       const newGuest = await createGuestSession();

//       // Insert new guest into guests table
//       await db.insert(guests).values({
//         id: newGuest.sessionToken,
//         sessionToken: newGuest.sessionToken,
//         expiresAt: newGuest.expiresAt,
//       });

//       const newCart = await db
//         .insert(carts)
//         .values({ guestId: newGuest.sessionToken })
//         .returning({ id: carts.id });
//       return { cartId: newCart[0].id, isGuest: true };
//     }
// }

// export async function getCart(): Promise<Cart | null> {
//   try {
//     const { cartId } = await getOrCreateCart();

//     const cartData = await db
//       .select({
//         cartId: carts.id,
//         itemId: cartItems.id,
//         productVariantId: cartItems.productVariantId,
//         quantity: cartItems.quantity,
//         variantId: productVariants.id,
//         sku: productVariants.sku,
//         price: productVariants.price,
//         salePrice: productVariants.salePrice,
//         productId: products.id,
//         productName: products.name,
//         productDescription: products.description,
//         colorId: colors.id,
//         colorName: colors.name,
//         colorHex: colors.hexCode,
//         sizeId: sizes.id,
//         sizeName: sizes.name,
//       })
//       .from(cartItems)
//       .innerJoin(carts, eq(cartItems.cartId, carts.id))
//       .innerJoin(productVariants, eq(cartItems.productVariantId, productVariants.id))
//       .innerJoin(products, eq(productVariants.productId, products.id))
//       .innerJoin(colors, eq(productVariants.colorId, colors.id))
//       .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
//       .where(eq(carts.id, cartId));

//     // Get images for each variant
//     const variantIds = cartData.map(item => item.variantId);
//     const imagesData = variantIds.length > 0 ? await db
//       .select({
//         variantId: productImages.variantId,
//         id: productImages.id,
//         url: productImages.url,
//         isPrimary: productImages.isPrimary,
//       })
//       .from(productImages)
//       .where(and(
//         productImages.variantId ? eq(productImages.variantId, variantIds[0]) : undefined, // Simplified for now
//         eq(productImages.isPrimary, true)
//       ))
//       .limit(variantIds.length) : [];

//     const items: CartItem[] = cartData.map(item => {
//       const primaryImage = imagesData.find(img => img.variantId === item.variantId);

//       return {
//         id: item.itemId,
//         productVariantId: item.productVariantId,
//         quantity: item.quantity,
//         variant: {
//           id: item.variantId,
//           sku: item.sku,
//           price: item.price,
//           salePrice: item.salePrice || undefined,
//           product: {
//             id: item.productId,
//             name: item.productName,
//             description: item.productDescription,
//           },
//           color: {
//             id: item.colorId,
//             name: item.colorName,
//             hexCode: item.colorHex,
//           },
//           size: {
//             id: item.sizeId,
//             name: item.sizeName,
//           },
//           images: primaryImage ? [{
//             id: primaryImage.id,
//             url: primaryImage.url,
//             isPrimary: primaryImage.isPrimary,
//           }] : [],
//         },
//       };
//     });

//     const total = items.reduce((sum, item) => {
//       const price = parseFloat(item.variant.price);
//       return sum + price * item.quantity;
//     }, 0);

//     return {
//       id: cartId,
//       items,
//       total,
//       itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
//     };
//   } catch (error) {
//     console.error("Error fetching cart:", error);
//     return null;
//   }
// }

// export async function addCartItem(productVariantId: string, quantity: number = 1) {
//   try {
//     const { cartId } = await getOrCreateCart();

//     // Check if item already exists
//     const existingItem = await db
//       .select()
//       .from(cartItems)
//       .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productVariantId, productVariantId)))
//       .limit(1);

//     if (existingItem.length) {
//       // Update quantity
//       await db
//         .update(cartItems)
//         .set({ quantity: existingItem[0].quantity + quantity })
//         .where(eq(cartItems.id, existingItem[0].id));
//     } else {
//       // Add new item
//       await db.insert(cartItems).values({
//         cartId,
//         productVariantId,
//         quantity,
//       });
//     }

//     revalidatePath("/cart");
//     return { success: true };
//   } catch (error) {
//     console.error("Error adding cart item:", error);
//     return { success: false, error: "Failed to add item to cart" };
//   }
// }

// export async function updateCartItem(itemId: string, quantity: number) {
//   try {
//     if (quantity <= 0) {
//       await removeCartItem(itemId);
//       return { success: true };
//     }

//     await db
//       .update(cartItems)
//       .set({ quantity })
//       .where(eq(cartItems.id, itemId));

//     revalidatePath("/cart");
//     return { success: true };
//   } catch (error) {
//     console.error("Error updating cart item:", error);
//     return { success: false, error: "Failed to update cart item" };
//   }
// }

// export async function removeCartItem(itemId: string) {
//   try {
//     await db.delete(cartItems).where(eq(cartItems.id, itemId));
//     revalidatePath("/cart");
//     return { success: true };
//   } catch (error) {
//     console.error("Error removing cart item:", error);
//     return { success: false, error: "Failed to remove cart item" };
//   }
// }

// export async function clearCart() {
//   try {
//     const { cartId } = await getOrCreateCart();
//     await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
//     revalidatePath("/cart");
//     return { success: true };
//   } catch (error) {
//     console.error("Error clearing cart:", error);
//     return { success: false, error: "Failed to clear cart" };
//   }
// }


"use server";

import { db } from "@/lib/db";
import { carts, cartItems } from "@/lib/db/schema/carts";
import { productVariants } from "@/lib/db/schema/variants";
import { products } from "@/lib/db/schema/products";
import { colors } from "@/lib/db/schema/filters/colors";
import { sizes } from "@/lib/db/schema/filters/sizes";
import { productImages } from "@/lib/db/schema/images";
// import { guests } from "@/lib/db/schema/guest";
// import { users } from "@/lib/db/schema/user";
import { eq, and, inArray } from "drizzle-orm";
import { guestSession, getCurrentUser, createGuestSession } from "@/lib/auth/actions";
import { revalidatePath } from "next/cache";

// ----------- Types -----------
export type CartItem = {
  id: string;
  productVariantId: string;
  quantity: number;
  variant: {
    id: string;
    sku: string;
    price: string;
    salePrice?: string;
    product: {
      id: string;
      name: string;
      description: string;
    };
    color: {
      id: string;
      name: string;
      hexCode: string;
    };
    size: {
      id: string;
      name: string;
    };
    images: Array<{
      id: string;
      url: string;
      isPrimary: boolean;
    }>;
  };
};

export type Cart = {
  id: string;
  items: CartItem[];
  total: number;
  itemCount: number;
};

// ----------- Core Helpers -----------

/**
 * Gets or creates a cart for either a logged-in user or a guest session.
 * If a guest logs in, merges guest cart into user cart.
 */
async function getOrCreateCart(): Promise<{ cartId: string; isGuest: boolean }> {
  const user = await getCurrentUser();
  const guest = await guestSession();

  if (user) {
    // If user just logged in and also has a guest session → merge guest cart into user cart
    if (guest?.sessionToken) {
      const guestCart = await db
        .select()
        .from(carts)
        .where(eq(carts.guestId, guest.sessionToken))
        .limit(1);

      if (guestCart.length) {
        const userCart = await db
          .select()
          .from(carts)
          .where(eq(carts.userId, user.id))
          .limit(1);

        // Create new user cart if missing
        // if (!userCart.length) {
        //   const newUserCart = await db
        //     .insert(carts)
        //     .values({ userId: user.id })
        //     .returning({ id: carts.id });
        //   // userCart = [{ id: newUserCart[0].id }];
        // }

        // Merge guest cart items into user cart
        const guestItems = await db
          .select()
          .from(cartItems)
          .where(eq(cartItems.cartId, guestCart[0].id));

        for (const item of guestItems) {
          const existing = await db
            .select()
            .from(cartItems)
            .where(and(eq(cartItems.cartId, userCart[0].id), eq(cartItems.productVariantId, item.productVariantId)))
            .limit(1);

          if (existing.length) {
            await db
              .update(cartItems)
              .set({ quantity: existing[0].quantity + item.quantity })
              .where(eq(cartItems.id, existing[0].id));
          } else {
            await db.insert(cartItems).values({
              cartId: userCart[0].id,
              productVariantId: item.productVariantId,
              quantity: item.quantity,
            });
          }
        }

        // Delete guest cart
        await db.delete(cartItems).where(eq(cartItems.cartId, guestCart[0].id));
        await db.delete(carts).where(eq(carts.id, guestCart[0].id));
      }
    }

    // Ensure user has a cart
    const cart = await db.select().from(carts).where(eq(carts.userId, user.id)).limit(1);
    if (!cart.length) {
      const newCart = await db.insert(carts).values({ userId: user.id }).returning({ id: carts.id });
      return { cartId: newCart[0].id, isGuest: false };
    }
    return { cartId: cart[0].id, isGuest: false };
  }

  // Guest user
  if (guest?.sessionToken) {
    const cart = await db.select().from(carts).where(eq(carts.guestId, guest.sessionToken)).limit(1);
    if (!cart.length) {
      const newCart = await db.insert(carts).values({ guestId: guest.sessionToken }).returning({ id: carts.id });
      return { cartId: newCart[0].id, isGuest: true };
    }
    return { cartId: cart[0].id, isGuest: true };
  }

  // Create new guest session
  const newGuest = await createGuestSession();

  // await db.insert(guests).values({
  //   id: newGuest.sessionToken,
  //   sessionToken: newGuest.sessionToken,
  //   // expiresAt: newGuest.expiresAt,
  // });

  const newCart = await db.insert(carts).values({ guestId: newGuest.sessionToken }).returning({ id: carts.id });
  return { cartId: newCart[0].id, isGuest: true };
}

// ----------- Cart Queries -----------

export async function getCart(): Promise<Cart | null> {
  try {
    const { cartId } = await getOrCreateCart();

    const cartData = await db
      .select({
        cartId: carts.id,
        itemId: cartItems.id,
        productVariantId: cartItems.productVariantId,
        quantity: cartItems.quantity,
        variantId: productVariants.id,
        sku: productVariants.sku,
        price: productVariants.price,
        salePrice: productVariants.salePrice,
        productId: products.id,
        productName: products.name,
        productDescription: products.description,
        colorId: colors.id,
        colorName: colors.name,
        colorHex: colors.hexCode,
        sizeId: sizes.id,
        sizeName: sizes.name,
      })
      .from(cartItems)
      .innerJoin(carts, eq(cartItems.cartId, carts.id))
      .innerJoin(productVariants, eq(cartItems.productVariantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .innerJoin(colors, eq(productVariants.colorId, colors.id))
      .innerJoin(sizes, eq(productVariants.sizeId, sizes.id))
      .where(eq(carts.id, cartId));

    const variantIds = cartData.map((item) => item.variantId);

    // Fetch images for all variants
    const imagesData =
      variantIds.length > 0
        ? await db
            .select({
              variantId: productImages.variantId,
              id: productImages.id,
              url: productImages.url,
              isPrimary: productImages.isPrimary,
            })
            .from(productImages)
            .where(inArray(productImages.variantId, variantIds))
        : [];

    const items: CartItem[] = cartData.map((item) => {
      const variantImages = imagesData.filter((img) => img.variantId === item.variantId);
      return {
        id: item.itemId,
        productVariantId: item.productVariantId,
        quantity: item.quantity,
        variant: {
          id: item.variantId,
          sku: item.sku,
          price: item.price,
          salePrice: item.salePrice || undefined,
          product: {
            id: item.productId,
            name: item.productName,
            description: item.productDescription,
          },
          color: {
            id: item.colorId,
            name: item.colorName,
            hexCode: item.colorHex,
          },
          size: {
            id: item.sizeId,
            name: item.sizeName,
          },
          images: variantImages.map((img) => ({
            id: img.id,
            url: img.url,
            isPrimary: img.isPrimary,
          })),
        },
      };
    });

    const total = items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);

    return {
      id: cartId,
      items,
      total,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return null;
  }
}

// ----------- Cart Mutations -----------

export async function addCartItem(productVariantId: string, quantity: number = 1) {
  try {
    const { cartId } = await getOrCreateCart();

    const existingItem = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.cartId, cartId), eq(cartItems.productVariantId, productVariantId)))
      .limit(1);

    if (existingItem.length) {
      await db
        .update(cartItems)
        .set({ quantity: existingItem[0].quantity + quantity })
        .where(eq(cartItems.id, existingItem[0].id));
    } else {
      await db.insert(cartItems).values({ cartId, productVariantId, quantity });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error adding cart item:", error);
    return { success: false, error: "Failed to add item to cart" };
  }
}

export async function updateCartItem(itemId: string, quantity: number) {
  try {
    if (quantity <= 0) {
      await removeCartItem(itemId);
      return { success: true };
    }

    await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, itemId));
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, error: "Failed to update cart item" };
  }
}

export async function removeCartItem(itemId: string) {
  try {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { success: false, error: "Failed to remove cart item" };
  }
}

export async function clearCart() {
  try {
    const { cartId } = await getOrCreateCart();
    await db.delete(cartItems).where(eq(cartItems.cartId, cartId));
    revalidatePath("/cart");
    return { success: true };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}
