"use server";

import { supabaseAdmin } from "@/lib/supabase";
import { redirect } from "next/navigation";

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
    .substring(2)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("products")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabaseAdmin.storage
    .from("products")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function createProduct(formData: FormData) {
  const title = String(formData.get("title") || "");
  const slugInput = String(formData.get("slug") || "");
  const description = String(formData.get("description") || "");
  const categoryId = String(formData.get("category_id") || "");
  const status = String(formData.get("status") || "active");

  const slug = slugInput ? slugify(slugInput) : slugify(title);

  const mainImageFile = formData.get("main_image") as File | null;
  const mainImageUrl = await uploadFile(mainImageFile, "main");

  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .insert({
      title,
      slug,
      description,
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

  for (let i = 1; i <= 5; i++) {
    const name = String(formData.get(`variation_name_${i}`) || "");
    const value = String(formData.get(`variation_value_${i}`) || "");
    const price = Number(formData.get(`variation_price_${i}`) || 0);
    const stock = Number(formData.get(`variation_stock_${i}`) || 0);
    const sku = String(formData.get(`variation_sku_${i}`) || "");
    const description = String(formData.get(`variation_description_${i}`) || "");

    const variationImageFile = formData.get(`variation_image_${i}`) as File | null;
    const variationImageUrl = await uploadFile(variationImageFile, "variations");

    if (name && value && price > 0) {
      await supabaseAdmin.from("product_variations").insert({
        product_id: product.id,
        name,
        value,
        price,
        stock,
        sku,
        description,
        image: variationImageUrl,
      });
    }
  }

  redirect("/admin/products");
}