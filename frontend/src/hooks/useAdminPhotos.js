import { useState, useEffect, useCallback, useRef } from "react"
import { supabase, getPhotoUrl } from "../lib/supabase"

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export function useAdminPhotos() {
  const [categories, setCategories] = useState([])
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const cancelledRef = useRef(false)

  const refresh = useCallback(async () => {
    if (cancelledRef.current) return

    setLoading(true)
    setError(null)
    try {
      const [{ data: cats, error: catErr }, { data: pics, error: picErr }] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase
          .from("photos")
          .select(
            "id, title, storage_path, is_featured, sort_order, category_id, category:categories(id, name, slug)"
          )
          .order("sort_order", { ascending: true }),
      ])
      if (catErr) throw catErr
      if (picErr) throw picErr
      if (cancelledRef.current) return

      setCategories(cats ?? [])
      if (cancelledRef.current) return

      setPhotos((pics ?? []).map((p) => ({ ...p, url: getPhotoUrl(p.storage_path) })))
    } catch (err) {
      if (!cancelledRef.current) setError(err.message)
    } finally {
      if (!cancelledRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    cancelledRef.current = false

    const timeoutId = window.setTimeout(() => {
      void refresh()
    }, 0)

    return () => {
      cancelledRef.current = true
      window.clearTimeout(timeoutId)
    }
  }, [refresh])

  const addCategory = async (name) => {
    const trimmed = name.trim()
    if (!trimmed) throw new Error("Category name can't be empty")
    const slug = slugify(trimmed)
    const { error } = await supabase.from("categories").insert({ name: trimmed, slug })
    if (error) throw error
    await refresh()
  }

  const deleteCategory = async (category) => {
    const count = photos.filter((p) => p.category_id === category.id).length
    if (count > 0) {
      throw new Error(
        `"${category.name}" still has ${count} photo(s) in it. Move or delete those first.`
      )
    }
    const { error } = await supabase.from("categories").delete().eq("id", category.id)
    if (error) throw error
    await refresh()
  }

  const uploadPhoto = async ({ file, title, categoryId, isFeatured }) => {
    if (!file) throw new Error("Pick a file first")
    if (!categoryId) throw new Error("Pick a category first")

    const ext = file.name.split(".").pop()
    const path = `${categoryId}/${crypto.randomUUID()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from("Photos")
      .upload(path, file, { cacheControl: "3600", upsert: false })
    if (uploadError) throw uploadError

    const maxSort = photos.reduce((max, p) => Math.max(max, p.sort_order ?? 0), 0)

    const { error: insertError } = await supabase.from("photos").insert({
      title: title || null,
      storage_path: path,
      category_id: categoryId,
      is_featured: !!isFeatured,
      sort_order: maxSort + 1,
    })

    if (insertError) {
      // roll back the uploaded file so storage doesn't accumulate orphans
      await supabase.storage.from("Photos").remove([path])
      throw insertError
    }

    await refresh()
  }

  const deletePhoto = async (photo) => {
    const { error: storageError } = await supabase.storage
      .from("Photos")
      .remove([photo.storage_path])
    if (storageError) throw storageError

    const { error } = await supabase.from("photos").delete().eq("id", photo.id)
    if (error) throw error
    await refresh()
  }

  const toggleFeatured = async (photo) => {
    const { error } = await supabase
      .from("photos")
      .update({ is_featured: !photo.is_featured })
      .eq("id", photo.id)
    if (error) throw error
    await refresh()
  }

  const movePhoto = async (photo, direction) => {
    // find neighbor in the same category to swap sort_order with
    const siblings = photos
      .filter((p) => p.category_id === photo.category_id)
      .sort((a, b) => a.sort_order - b.sort_order)
    const idx = siblings.findIndex((p) => p.id === photo.id)
    const targetIdx = direction === "up" ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= siblings.length) return

    const target = siblings[targetIdx]
    const { error: e1 } = await supabase
      .from("photos")
      .update({ sort_order: target.sort_order })
      .eq("id", photo.id)
    const { error: e2 } = await supabase
      .from("photos")
      .update({ sort_order: photo.sort_order })
      .eq("id", target.id)
    if (e1) throw e1
    if (e2) throw e2
    await refresh()
  }

  return {
    categories,
    photos,
    loading,
    error,
    addCategory,
    deleteCategory,
    uploadPhoto,
    deletePhoto,
    toggleFeatured,
    movePhoto,
    refresh,
  }
}
