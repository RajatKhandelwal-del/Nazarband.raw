import { useState, useEffect, useRef, useMemo } from 'react'
import { supabase, getPhotoUrl } from '../lib/supabase'

export function usePhotos(categorySlug = null) {
  const [photos, setPhotos]         = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const abortRef                    = useRef(false)

  useEffect(() => {
  supabase
    .from('categories')
    .select('*')
    .order('name')
    .then(({ data, error }) => {
      console.log('categories data:', data)
      console.log('categories error:', error)
      if (!error && data) setCategories(data)
    })
}, [])

  useEffect(() => {
    abortRef.current = false

    const run = async () => {
        setLoading(true)
        setError(null)
      try {
        let query = supabase
        .from("photos")
        .select(`
            id,
            title,
            storage_path,
            is_featured,
            sort_order,
            category:categories(id, name, slug)
        `)
        .order("sort_order", { ascending: true });

        if (categorySlug) {
            const { data: category, error } = await supabase
                .from("categories")
                .select("id")
                .eq("slug", categorySlug)
                .single();

            if (error) throw error;

            query = query.eq("category_id", category.id);
        }
        

        const { data, error } = await query
        console.log('photos data:', data)
        console.log('photos error:', error)
        if (abortRef.current) return  // discard stale response

        if (error) throw error

        const withUrls = data.map(p => ({
            ...p,
            url: getPhotoUrl(p.storage_path)
        }))
        console.log('photo urls:', withUrls.map(p => p.url))

        setPhotos(withUrls)
      } catch (err) {
        if (!abortRef.current) setError(err.message)
      } finally {
        if (!abortRef.current) setLoading(false)
      }
    }

    run()

    return () => { abortRef.current = true }  // cleanup on category change
  }, [categorySlug])

  // Memoized so it doesn't recompute on every render
  const featured = useMemo(
    () => photos.filter(p => p.is_featured).slice(0, 6),
    [photos]
  )

  return { photos, featured, categories, loading, error }
}