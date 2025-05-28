import Image from "next/image"

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] gap-8 p-8">
      <div className="text-center space-y-4">
      <div className="flex justify-center">
        <Image
          src="./logo.png"
          alt="Cinema CMS Logo"
          width={200}
          height={200}
          className="object-contain"
          priority
        />
      </div>
        <p className="text-xl text-gray-600 max-w-3xl">
          Chào mừng bạn đến với hệ thống quản lý rạp chiếu phim. <br />
          Bắt đầu hoạt động quản lý các rạp phim, suất chiếu, vé và doanh thu một cách hiệu quả.
        </p>
      </div>
      <div className="text-center">
        <p className="text-lg text-gray-500">
          Sử dụng menu bên trái để bắt đầu quản lý hệ thống của bạn
        </p>
      </div>
    </div>
  )
}
