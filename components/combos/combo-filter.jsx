import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function ComboFilter({ searchTerm, setSearchTerm, searchInputRef }) {
    return (
    <div className="relative flex mb-4 gap-2">
      <div>
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          ref={searchInputRef}
          type="search"
          placeholder="Tìm kiếm combo..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
    )
}
