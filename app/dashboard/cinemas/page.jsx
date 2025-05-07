"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import CinemaList from "@/components/cinemas/cinema-list"
import { CinemaDialog } from "@/components/cinemas/cinema-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetCinemas } from "@/hooks/use-cinema"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"

export default function CinemasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [isCinemaDialogOpen, setIsCinemaDialogOpen] = useState(false)
  const [selectedCinema, setSelectedCinema] = useState(null)
  const [cinemaToDelete, setCinemaToDelete] = useState(null)
  const [dialogMode, setDialogMode] = useState("view")
  const [cinemas, setCinemas] = useState()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const router = useRouter()

  const filteredCinemas = cinemas?.filter((cinema) => 
    cinema.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddCinema = () => {
    setSelectedCinema(null)
    setDialogMode("add")
    setIsCinemaDialogOpen(true)
  }
  const handleViewCinema = (cinema) => {
    router.push(`/dashboard/cinemas/${cinema.id}`)
  }
  const handleDeleteClick = (id) => {
    setCinemaToDelete(id)
    setIsDeleteDialogOpen(true)
  }
  const handleDeleteConfirm = () => {
    setCinemas(cinemas?.filter((cinema) => cinema.id !== cinemaToDelete))
    setIsDeleteDialogOpen(false)
    setCinemaToDelete(null)
  }

  const handleSaveCinema = (cinemaData) => {
    console.log(cinemaData)
    if (dialogMode === "add") {
      const newCinema = {
        ...cinemaData,
      }

    } else if (dialogMode === "edit") {
      setCinemas(
        cinemas.map((cinema) =>
          cinema.id === cinemaData.id
            ? cinemaData
            : cinema
        )
      )
    }
  }
  
  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Quản lý rạp phim</h2>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCinema}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm rạp phim
        </Button>
      </div>

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <CinemaList handleViewCinema={handleViewCinema} handleDeleteClick={handleDeleteClick} setCinemas={setCinemas}/>
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="pb-3">Xác nhận xóa</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa rạp này? Hành động này không thể hoàn tác.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <CinemaDialog
        isOpen={isCinemaDialogOpen}
        onClose={() => setIsCinemaDialogOpen(false)}
        cinema={selectedCinema}
        mode={dialogMode}
        onSave={handleSaveCinema}
        setDialogMode={setDialogMode}
        setIsCinemaDialogOpen={setIsCinemaDialogOpen}
      />
    </div>
  )
}
