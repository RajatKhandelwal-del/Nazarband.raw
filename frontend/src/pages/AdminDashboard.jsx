import { useState } from "react"
import { useAuth } from "../lib/AuthContext"
import { useAdminPhotos } from "../hooks/useAdminPhotos"
import "./admin.css"

export default function AdminDashboard() {
  const { logout } = useAuth()
  const {
    categories,
    photos,
    loading,
    addCategory,
    deleteCategory,
    uploadPhoto,
    deletePhoto,
    toggleFeatured,
    movePhoto,
  } = useAdminPhotos()

  const [newCategoryName, setNewCategoryName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(null) // for filtering photo list + upload target
  const [uploadTitle, setUploadTitle] = useState("")
  const [uploadFile, setUploadFile] = useState(null)
  const [uploadFeatured, setUploadFeatured] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [banner, setBanner] = useState(null) // { type: 'error'|'success', text }

  const flash = (type, text) => {
    setBanner({ type, text })
    setTimeout(() => setBanner(null), 4000)
  }

  const handleAddCategory = async (e) => {
    e.preventDefault()
    try {
      await addCategory(newCategoryName)
      setNewCategoryName("")
      flash("success", "Category added")
    } catch (err) {
      flash("error", err.message)
    }
  }

  const handleDeleteCategory = async (cat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return
    try {
      await deleteCategory(cat)
      if (selectedCategory === cat.id) setSelectedCategory(null)
      flash("success", "Category deleted")
    } catch (err) {
      flash("error", err.message)
    }
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    setUploading(true)
    try {
      await uploadPhoto({
        file: uploadFile,
        title: uploadTitle,
        categoryId: selectedCategory,
        isFeatured: uploadFeatured,
      })
      setUploadTitle("")
      setUploadFile(null)
      setUploadFeatured(false)
      e.target.reset()
      flash("success", "Photo uploaded")
    } catch (err) {
      flash("error", err.message)
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePhoto = async (photo) => {
    if (!window.confirm("Delete this photo?")) return
    try {
      await deletePhoto(photo)
      flash("success", "Photo deleted")
    } catch (err) {
      flash("error", err.message)
    }
  }

  const visiblePhotos = selectedCategory
    ? photos.filter((p) => p.category_id === selectedCategory)
    : photos

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Nazarband — Admin</h1>
        <button className="admin-logout" onClick={logout}>Log out</button>
      </header>

      {banner && (
        <div className={`admin-banner admin-banner--${banner.type}`}>{banner.text}</div>
      )}

      <div className="admin-grid">
        {/* Categories panel */}
        <section className="admin-panel">
          <h2>Categories</h2>

          <form className="admin-inline-form" onSubmit={handleAddCategory}>
            <input
              type="text"
              placeholder="New category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              required
            />
            <button type="submit">Add</button>
          </form>

          <ul className="admin-category-list">
            <li
              className={`admin-category-item ${selectedCategory === null ? "is-active" : ""}`}
              onClick={() => setSelectedCategory(null)}
            >
              <span>All photos</span>
              <span className="admin-category-count">{photos.length}</span>
            </li>
            {categories.map((cat) => {
              const count = photos.filter((p) => p.category_id === cat.id).length
              return (
                <li
                  key={cat.id}
                  className={`admin-category-item ${selectedCategory === cat.id ? "is-active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span>{cat.name}</span>
                  <span className="admin-category-count">{count}</span>
                  <button
                    className="admin-delete-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteCategory(cat)
                    }}
                    title="Delete category"
                  >
                    ✕
                  </button>
                </li>
              )
            })}
          </ul>
        </section>

        {/* Upload panel */}
        <section className="admin-panel">
          <h2>Upload photo</h2>
          <form className="admin-upload-form" onSubmit={handleUpload}>
            <label>
              Category
              <select
                value={selectedCategory ?? ""}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                required
              >
                <option value="" disabled>Choose a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </label>

            <label>
              Title (optional)
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
              />
            </label>

            <label>
              File
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setUploadFile(e.target.files[0])}
                required
              />
            </label>

            <label className="admin-checkbox-label">
              <input
                type="checkbox"
                checked={uploadFeatured}
                onChange={(e) => setUploadFeatured(e.target.checked)}
              />
              Feature on homepage
            </label>

            <button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </section>
      </div>

      {/* Photo list */}
      <section className="admin-panel admin-panel--wide">
        <h2>
          Photos {selectedCategory
            ? `— ${categories.find((c) => c.id === selectedCategory)?.name ?? ""}`
            : "(all)"}
        </h2>

        {loading ? (
          <p className="admin-muted">Loading...</p>
        ) : visiblePhotos.length === 0 ? (
          <p className="admin-muted">No photos here yet.</p>
        ) : (
          <div className="admin-photo-grid">
            {visiblePhotos.map((photo) => (
              <div key={photo.id} className="admin-photo-card">
                <img src={photo.url} alt={photo.title || "photo"} />
                <div className="admin-photo-meta">
                  <span className="admin-photo-title">{photo.title || "Untitled"}</span>
                  <span className="admin-photo-category">{photo.category?.name}</span>
                </div>
                <div className="admin-photo-actions">
                  <button onClick={() => movePhoto(photo, "up")} title="Move up">↑</button>
                  <button onClick={() => movePhoto(photo, "down")} title="Move down">↓</button>
                  <button
                    onClick={() => toggleFeatured(photo)}
                    className={photo.is_featured ? "is-featured" : ""}
                    title="Toggle featured"
                  >
                    ★
                  </button>
                  <button onClick={() => handleDeletePhoto(photo)} title="Delete" className="admin-delete-btn">
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
