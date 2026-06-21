"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function uploadFile(file: File | null, folder: string) {
  if (!file || file.size === 0) return "";

  const ext = file.name.split(".").pop();
  const fileName = `${folder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("products")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabaseAdmin.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function createProduct(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "");
  const categoryId = String(formData.get("category_id") || "");
  const status = String(formData.get("status") || "active");
  const price = Number(formData.get("price") || 0);

  if (!title) throw new Error("Product title is required");

  const slug = slugInput ? slugify(slugInput) : slugify(title);

  const mainImageUrl = await uploadFile(
    formData.get("main_image") as File | null,
    "main"
  );

  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .insert({
      title,
      slug,
      description,
      price,
      main_image: mainImageUrl,
      status,
    })
    .select("*")
    .single();

  if (productError || !product) {
    throw new Error(productError?.message || "Product create failed");
  }

  if (categoryId) {
    await supabaseAdmin.from("product_categories").insert({
      product_id: product.id,
      category_id: categoryId,
    });
  }

  const galleryFiles = formData.getAll("gallery") as File[];

  for (let i = 0; i < galleryFiles.length; i++) {
    const file = galleryFiles[i];

    if (file && file.size > 0) {
      const imageUrl = await uploadFile(file, "gallery");

      await supabaseAdmin.from("product_gallery").insert({
        product_id: product.id,
        image: imageUrl,
        sort_order: i,
      });
    }
  }

  const variationNames = formData.getAll("variation_name");
  const variationValues = formData.getAll("variation_value");
  const variationPrices = formData.getAll("variation_price");
  const variationStocks = formData.getAll("variation_stock");
  const variationSkus = formData.getAll("variation_sku");
  const variationImages = formData.getAll("variation_image") as File[];

  for (let i = 0; i < variationNames.length; i++) {
    const name = String(variationNames[i] || "");
    const value = String(variationValues[i] || "");
    const vPrice = Number(variationPrices[i] || 0);
    const stock = Number(variationStocks[i] || 0);
    const sku = String(variationSkus[i] || "");

    if (name && value && vPrice > 0) {
      const variationImageUrl = await uploadFile(
        variationImages[i] || null,
        "variations"
      );

      await supabaseAdmin.from("product_variations").insert({
        product_id: product.id,
        name,
        value,
        price: vPrice,
        stock,
        sku,
        image: variationImageUrl,
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");

  redirect("/admin/products?success=Product added successfully");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) throw new Error("Product ID missing");

  await supabaseAdmin.from("product_gallery").delete().eq("product_id", id);
  await supabaseAdmin.from("product_variations").delete().eq("product_id", id);
  await supabaseAdmin.from("product_categories").delete().eq("product_id", id);
  await supabaseAdmin.from("products").delete().eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/shop");

  redirect("/admin/products?success=Product deleted successfully");
}

export async function updateProduct(formData: FormData) {
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const description = String(formData.get("description") || "");
  const categoryId = String(formData.get("category_id") || "");
  const status = String(formData.get("status") || "active");
  const price = Number(formData.get("price") || 0);

  if (!id) throw new Error("Product ID missing");
  if (!title) throw new Error("Product title is required");

  const slug = slugInput ? slugify(slugInput) : slugify(title);

  const updateData: any = {
    title,
    slug,
    description,
    price,
    status,
  };

  const mainImageFile = formData.get("main_image") as File | null;
  const newImageUrl = await uploadFile(mainImageFile, "main");

  if (newImageUrl) {
    updateData.main_image = newImageUrl;
  }

  const { error } = await supabaseAdmin
    .from("products")
    .update(updateData)
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabaseAdmin.from("product_categories").delete().eq("product_id", id);

  if (categoryId) {
    await supabaseAdmin.from("product_categories").insert({
      product_id: id,
      category_id: categoryId,
    });
  }

  const galleryFiles = formData.getAll("gallery") as File[];

  for (let i = 0; i < galleryFiles.length; i++) {
    const file = galleryFiles[i];

    if (file && file.size > 0) {
      const imageUrl = await uploadFile(file, "gallery");

      await supabaseAdmin.from("product_gallery").insert({
        product_id: id,
        image: imageUrl,
        sort_order: i,
      });
    }
  }

  const variationIds = formData.getAll("variation_id");
  const variationNames = formData.getAll("variation_name");
  const variationValues = formData.getAll("variation_value");
  const variationPrices = formData.getAll("variation_price");
  const variationStocks = formData.getAll("variation_stock");
  const variationSkus = formData.getAll("variation_sku");
  const variationImages = formData.getAll("variation_image") as File[];

  for (let i = 0; i < variationIds.length; i++) {
    const variationId = String(variationIds[i] || "");
    const name = String(variationNames[i] || "");
    const value = String(variationValues[i] || "");
    const variationPrice = Number(variationPrices[i] || 0);
    const stock = Number(variationStocks[i] || 0);
    const sku = String(variationSkus[i] || "");

    const updateVariationData: any = {
      name,
      value,
      price: variationPrice,
      stock,
      sku,
    };

    const imageUrl = await uploadFile(variationImages[i] || null, "variations");

    if (imageUrl) {
      updateVariationData.image = imageUrl;
    }

    if (variationId) {
      await supabaseAdmin
        .from("product_variations")
        .update(updateVariationData)
        .eq("id", variationId);
    }
  }

  const newVariationNames = formData.getAll("new_variation_name");
  const newVariationValues = formData.getAll("new_variation_value");
  const newVariationPrices = formData.getAll("new_variation_price");
  const newVariationStocks = formData.getAll("new_variation_stock");
  const newVariationSkus = formData.getAll("new_variation_sku");
  const newVariationImages = formData.getAll("new_variation_image") as File[];

  for (let i = 0; i < newVariationNames.length; i++) {
    const name = String(newVariationNames[i] || "");
    const value = String(newVariationValues[i] || "");
    const newPrice = Number(newVariationPrices[i] || 0);
    const stock = Number(newVariationStocks[i] || 0);
    const sku = String(newVariationSkus[i] || "");

    if (name && value && newPrice > 0) {
      const imageUrl = await uploadFile(
        newVariationImages[i] || null,
        "variations"
      );

      await supabaseAdmin.from("product_variations").insert({
        product_id: id,
        name,
        value,
        price: newPrice,
        stock,
        sku,
        image: imageUrl,
      });
    }
  }

  revalidatePath("/admin");
  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}/edit`);
  revalidatePath("/");
  revalidatePath("/shop");

  redirect("/admin/products?success=Product updated successfully");
}

export async function createCategory(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const parentId = String(formData.get("parent_id") || "");
  const status = String(formData.get("status") || "active");

  if (!name) throw new Error("Category name is required");

  const slug = slugInput ? slugify(slugInput) : slugify(name);

  const imageUrl = await uploadFile(
    formData.get("image") as File | null,
    "categories"
  );

  const { error } = await supabaseAdmin.from("categories").insert({
    name,
    slug,
    parent_id: parentId || null,
    image: imageUrl,
    status,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  redirect("/admin/categories?success=Category added successfully");
}

export async function updateCategory(formData: FormData) {
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slugInput = String(formData.get("slug") || "").trim();
  const parentId = String(formData.get("parent_id") || "");
  const status = String(formData.get("status") || "active");

  if (!id) throw new Error("Category ID missing");
  if (!name) throw new Error("Category name is required");

  const slug = slugInput ? slugify(slugInput) : slugify(name);

  const imageUrl = await uploadFile(
    formData.get("image") as File | null,
    "categories"
  );

  const updateData: any = {
    name,
    slug,
    parent_id: parentId || null,
    status,
  };

  if (imageUrl) {
    updateData.image = imageUrl;
  }

  const { error } = await supabaseAdmin
    .from("categories")
    .update(updateData)
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath(`/admin/categories/${id}/edit`);
  revalidatePath("/");
  revalidatePath("/shop");

  redirect("/admin/categories?success=Category updated successfully");
}

export async function deleteCategory(formData: FormData) {
  const id = String(formData.get("id") || "");

  if (!id) throw new Error("Category ID missing");

  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/shop");

  redirect("/admin/categories?success=Category deleted successfully");
}

export async function updateOrderStatus(formData: FormData) {
  const id = String(formData.get("id") || "");
  const order_status = String(formData.get("order_status") || "pending");

  await supabaseAdmin.from("orders").update({ order_status }).eq("id", id);

  revalidatePath("/admin/orders");
  redirect("/admin/orders?success=Order updated successfully");
}