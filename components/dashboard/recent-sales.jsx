import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>NT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Nguyễn Thị Hương</p>
          <p className="text-sm text-muted-foreground">Avengers: Endgame - 2 vé</p>
        </div>
        <div className="ml-auto font-medium">+320,000đ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>TH</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Trần Huy Hoàng</p>
          <p className="text-sm text-muted-foreground">Joker - 1 vé</p>
        </div>
        <div className="ml-auto font-medium">+150,000đ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>LM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Lê Minh Đức</p>
          <p className="text-sm text-muted-foreground">Inception - 3 vé</p>
        </div>
        <div className="ml-auto font-medium">+450,000đ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>PL</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Phạm Lan Anh</p>
          <p className="text-sm text-muted-foreground">The Dark Knight - 2 vé</p>
        </div>
        <div className="ml-auto font-medium">+300,000đ</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/placeholder.svg?height=36&width=36" alt="Avatar" />
          <AvatarFallback>VT</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Vũ Thanh Tùng</p>
          <p className="text-sm text-muted-foreground">Parasite - 4 vé</p>
        </div>
        <div className="ml-auto font-medium">+600,000đ</div>
      </div>
    </div>
  )
}
