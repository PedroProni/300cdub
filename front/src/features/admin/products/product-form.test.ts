import { describe, expect, it } from "vitest";
import { hasErrors, validateProductInput } from "@/features/admin/products/product-form.validation";
import { validateImageFile } from "@/features/admin/products/image-validation";
import { formToInput, emptyProductForm } from "@/features/admin/products/product-form.mapper";
import { MAX_IMAGE_BYTES } from "@/features/admin/products/products-admin.constants";
import type { ProductInput } from "@/types/product.types";

const valid: ProductInput = {
  name: "Camiseta",
  description: "",
  categoryId: null,
  price: 50,
  promoPrice: null,
  variants: [{ label: "M", stock: 2 }],
  visible: true,
  featured: false,
};

describe("product validation", () => {
  it("accepts a valid input", () => {
    expect(hasErrors(validateProductInput(valid))).toBe(false);
  });

  it("rejects a short name and a non positive price", () => {
    const errors = validateProductInput({ ...valid, name: " a ", price: 0 });
    expect(errors.name).toBe("admin.products.errors.name");
    expect(errors.price).toBe("admin.products.errors.price");
  });

  it("requires the promo price to be lower than the price", () => {
    expect(validateProductInput({ ...valid, promoPrice: 50 }).promoPrice).toBe("admin.products.errors.promoPrice");
    expect(validateProductInput({ ...valid, promoPrice: 40 }).promoPrice).toBeUndefined();
  });

  it("rejects empty, duplicate and invalid stock variants", () => {
    expect(validateProductInput({ ...valid, variants: [{ label: " ", stock: 1 }] }).variants).toBe("admin.products.errors.variantLabel");
    expect(
      validateProductInput({
        ...valid,
        variants: [
          { label: "M", stock: 1 },
          { label: "m", stock: 1 },
        ],
      }).variants,
    ).toBe("admin.products.errors.variantDuplicate");
    expect(validateProductInput({ ...valid, variants: [{ label: "M", stock: -1 }] }).variants).toBe("admin.products.errors.variantStock");
    expect(validateProductInput({ ...valid, variants: [{ label: "M", stock: 1.5 }] }).variants).toBe("admin.products.errors.variantStock");
  });

  it("maps the form to the api input", () => {
    const form = { ...emptyProductForm(), name: " Boné ", price: 30, categoryId: "", variants: [{ label: " U ", stock: 3 }] };
    expect(formToInput(form)).toMatchObject({ name: "Boné", categoryId: null, price: 30, variants: [{ label: "U", stock: 3 }] });
  });
});

describe("image validation", () => {
  it("accepts jpeg, png and webp within the limit", () => {
    for (const type of ["image/jpeg", "image/png", "image/webp"]) expect(validateImageFile(new File(["x"], "a", { type }))).toBeNull();
  });

  it("rejects other types", () => {
    expect(validateImageFile(new File(["x"], "a.gif", { type: "image/gif" }))).toBe("errors.fileType");
    expect(validateImageFile(new File(["x"], "a.pdf", { type: "application/pdf" }))).toBe("errors.fileType");
  });

  it("rejects files above 5 MB", () => {
    const big = new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], "a.png", { type: "image/png" });
    expect(validateImageFile(big)).toBe("errors.fileTooLarge");
  });
});
