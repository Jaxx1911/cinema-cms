"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Edit, X, Image as ImageIcon, Tag, FileText, DollarSign } from "lucide-react"

const initialFormData = {
  name: "",
  description: "",
  price: "",
  banner: null,
}

export function ComboDialog({
  isOpen,
  onClose,
  mode,
  combo,
  onSave,
  onModeChange,
}) {
  const [formData, setFormData] = useState(initialFormData)
  const [bannerPreview, setBannerPreview] = useState("")
  const [bannerDimensions, setBannerDimensions] = useState({ width: 0, height: 0 })
  const bannerFileRef = useRef(null)

  useEffect(() => {
    if (combo && (mode === "view" || mode === "edit")) {
      setFormData({
        name: combo.name,
        description: combo.description,
        price: combo.price,
        banner: null,
      })

      // Set banner preview and dimensions
      if (combo.banner_url) {
        const img = new Image()
        img.onload = () => {
          setBannerDimensions({ width: img.width, height: img.height })
        }
        img.src = combo.banner_url
        setBannerPreview(combo.banner_url)
      }
    } else if (!combo || mode === "add") {
      setFormData(initialFormData)
      setBannerPreview("")
      setBannerDimensions({ width: 0, height: 0 })
    }
  }, [combo, mode, isOpen])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const img = new Image()
        img.onload = () => {
          setBannerDimensions({ width: img.width, height: img.height })
        }
        img.src = reader.result
        setBannerPreview(reader.result)
        setFormData((prev) => ({ ...prev, banner: file }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      if (formData.banner) {
        formDataToSend.append('banner_url', formData.banner);
      }

      if (mode === 'edit') {
        await onSave(formDataToSend);
      } else {
        await onSave(formDataToSend);
      }
    } catch (error) {
      console.error('Error saving combo:', error);
    }
  };

  const handleClose = () => {
    setFormData(initialFormData)
    setBannerPreview("")
    setBannerDimensions({ width: 0, height: 0 })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "view"
              ? "Chi tiết combo"
              : mode === "edit"
              ? "Chỉnh sửa combo"
              : "Thêm combo mới"}
          </DialogTitle>
          <DialogDescription>
            {mode === "view"
              ? "Xem thông tin chi tiết của combo"
              : "Điền thông tin combo vào form dưới đây"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Left column - Image */}
          <div className="space-y-2">
            
            <Label htmlFor="bannerUpload" className="flex items-center gap-2 text-lg font-medium">
              <ImageIcon className="h-4 w-4" />
              Hình ảnh
            </Label>
            <div className="relative overflow-hidden rounded-md border border-gray-200 bg-gray-50 flex items-center justify-center">
              {bannerPreview ? (
                <div className="lg:w-[500px] lg:h-[500px] w-[300px] h-[300px] relative">
                  <img
                    src={bannerPreview}
                    alt="Combo banner preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-[300px] h-[300px] text-center p-4 text-gray-400 flex flex-col items-center justify-center">
                  <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                  <p>Chưa có hình ảnh</p>
                </div>
              )}
            </div>
            {mode !== "view" && (
              <div>
                <input
                  ref={bannerFileRef}
                  type="file"
                  id="bannerUpload"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => bannerFileRef.current?.click()}
                  className="mt-2"
                >
                  Chọn hình ảnh
                </Button>
              </div>
            )}
          </div>

          {/* Right column - Combo information */}
          <div className="space-y-4">
            <div className="grid gap-2 mt-4">
              <Label htmlFor="name" className="flex items-center gap-2">
                <Tag className="h-4 w-4" /> Tên combo
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={mode === "view"}
                style={{
                  opacity: 1,
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description" className="flex items-center gap-2">
                <FileText className="h-4 w-4" /> Mô tả
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={mode === "view"}
                rows={4}
                style={{
                  opacity: 1,
                }}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="price" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> Giá (VNĐ)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                disabled={mode === "view"}
                style={{
                  opacity: 1,
                }}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between">
          {mode === "view" ? (
            <>
              
              <Button
                type="button"
                onClick={() => onModeChange("edit")}
                className="bg-white text-black border border-gray-300"
              >
                <Edit className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Đóng
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                <X className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button
                type="submit"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {mode === "edit" ? "Cập nhật" : "Thêm mới"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 