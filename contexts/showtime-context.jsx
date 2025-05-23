"use client"

import { createContext, useContext } from "react"
import { useGetMoviesByStatus} from "@/hooks/use-movie"
import { useCinemas, useScreensByCinema } from "@/hooks/use-cinemas"

const ShowtimeContext = createContext(null)

export function ShowtimeProvider({ children, selectedCinema }) {
  // Use existing hooks to fetch data
  const { data: newMoviesData, isLoading: isLoadingNewMovies } = useGetMoviesByStatus('new')
  const { data: incomingMoviesData, isLoading: isLoadingIncomingMovies } = useGetMoviesByStatus('incoming')
  const { cinemas, isLoading: isLoadingCinemas } = useCinemas()
  const { screens, isLoading: isLoadingScreens } = useScreensByCinema(selectedCinema)

  const newMovies = newMoviesData || []
  const incomingMovies = incomingMoviesData || []
  const isLoading = isLoadingNewMovies || isLoadingIncomingMovies || isLoadingCinemas || isLoadingScreens


  return (
    <ShowtimeContext.Provider value={{ newMovies, incomingMovies, cinemas, screens, isLoading }}>
      {children}
    </ShowtimeContext.Provider>
  )
}

export function useShowtimeData() {
  const context = useContext(ShowtimeContext)
  if (!context) {
    throw new Error("useShowtimeData must be used within a ShowtimeProvider")
  }
  return context
} 