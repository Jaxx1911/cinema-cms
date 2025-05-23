"use client"

import { useEffect } from "react"
import { Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useShowtimeData } from "@/contexts/showtime-context"

export function ShowtimeFilter({
  selectedMovie,
  setSelectedMovie,
  selectedCinema,
  setSelectedCinema,
  selectedScreen,
  setSelectedScreen,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  // Get filter data from context
  const { newMovies, incomingMovies, cinemas, screens, isLoading } = useShowtimeData()
  console.log(newMovies)
  console.log(incomingMovies)
  // Reset screen selection when cinema changes
  useEffect(() => {
    setSelectedScreen("all")
  }, [selectedCinema, setSelectedScreen])

  return (
    <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      <div>
        <Select 
          value={selectedMovie} 
          onValueChange={setSelectedMovie}
          disabled={isLoading}
        >
          <SelectTrigger className="border-gray-200 bg-white">
            <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn phim"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phim</SelectItem>
            {newMovies.map((movie) => (
              <SelectItem key={movie.id} value={movie.id.toString()}>
                {movie.title}
              </SelectItem>
            ))}
            {incomingMovies.map((movie) => (
              <SelectItem key={movie.id} value={movie.id.toString()}>
                {movie.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select 
          value={selectedCinema} 
          onValueChange={setSelectedCinema}
          disabled={isLoading}
        >
          <SelectTrigger className="border-gray-200 bg-white">
            <SelectValue placeholder={isLoading ? "Đang tải..." : "Chọn rạp"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả rạp</SelectItem>
            {cinemas.map((cinema) => (
              <SelectItem key={cinema.id} value={cinema.id.toString()}>
                {cinema.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Select 
          value={selectedScreen} 
          onValueChange={setSelectedScreen}
          disabled={selectedCinema === "all" || isLoading}
        >
          <SelectTrigger className="border-gray-200 bg-white">
            <SelectValue 
              placeholder={
                selectedCinema === "all" 
                  ? "Chọn rạp trước" 
                  : isLoading 
                    ? "Đang tải..." 
                    : "Chọn phòng"
              } 
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả phòng</SelectItem>
            {screens.map((screen) => (
              <SelectItem key={screen.id} value={screen.id.toString()}>
                {screen.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="pl-9 border-gray-200"
            placeholder="Từ ngày"
          />
        </div>
      </div>

      <div>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="pl-9 border-gray-200"
            placeholder="Đến ngày"
          />
        </div>
      </div>
    </div>
  )
} 