import { client } from "@/api/client"
import type { Category } from "@/types"

export function listCategories() {
  return client.get<Category[]>("/produtos/categorias").then((res) => res.data)
}

export function createCategory(name: string, description?: string) {
  return client
    .post<Category>("/produtos/categorias", { name, description })
    .then((res) => res.data)
}
