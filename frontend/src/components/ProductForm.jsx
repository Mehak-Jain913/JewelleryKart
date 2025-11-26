import { useEffect, useState } from 'react'

const initialState = { name: '', type: '', price: '', quantity: '', description: '', image_url: '' }

const ProductForm = ({ onSubmit, initialValues, submitLabel = 'Save', onCancel }) => {
  const [form, setForm] = useState(initialState)

  useEffect(() => {
    setForm(initialValues ? { ...initialState, ...initialValues } : initialState)
  }, [initialValues])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    }
    onSubmit?.(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <input name="type" value={form.type} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
        <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input type="number" name="quantity" value={form.quantity} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" required />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
        <input name="image_url" value={form.image_url} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
      </div>
      <div className="md:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" rows={3} />
      </div>
      <div className="md:col-span-2 flex gap-2">
        <button type="submit" className="px-4 py-2 bg-black text-white rounded-md">{submitLabel}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md">Cancel</button>
        )}
      </div>
    </form>
  )
}

export default ProductForm


