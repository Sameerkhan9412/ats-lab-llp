import Link from "next/link"

interface NavDoctorItemProps {
  href: string
  label: string
}

const NavDoctorItem = ({ href, label }: NavDoctorItemProps) => {
  return (
    <Link
      href={href}
      className="flex items-center justify-between rounded-lg px-3 py-2
      text-sm text-gray-700 hover:bg-[#F1F5FF] hover:text-[#4A7FD8]
      transition-all"
    >
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export default NavDoctorItem
