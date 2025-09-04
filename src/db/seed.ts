import { db } from "@/lib/db";
import { products, productVariants, colors, sizes, productImages } from "@/lib/db/schema";

export async function seedTestData() {
  // Insert colors
  const colorRed = await db.insert(colors).values([{ name: "Red", slug: "red", hexCode: "#FF0000" }]).returning();
  const colorBlue = await db.insert(colors).values([{ name: "Blue", slug: "blue", hexCode: "#0000FF" }]).returning();

  // Insert sizes
  const sizeSmall = await db.insert(sizes).values([{ name: "Small", slug: "small", sortOrder: 1 }]).returning();
  const sizeMedium = await db.insert(sizes).values([{ name: "Medium", slug: "medium", sortOrder: 2 }]).returning();

  // Insert product
  const product = await db.insert(products).values({
    name: "Test Shoe",
    description: "A test shoe product",
  }).returning();

  // Insert product variants
  const variant1 = await db.insert(productVariants).values({
    productId: product[0].id,
    sku: "TS-RED-S",
    price: "100.00",
    colorId: colorRed[0].id,
    sizeId: sizeSmall[0].id,
  }).returning();

  const variant2 = await db.insert(productVariants).values({
    productId: product[0].id,
    sku: "TS-BLUE-M",
    price: "110.00",
    colorId: colorBlue[0].id,
    sizeId: sizeMedium[0].id,
  }).returning();

}
