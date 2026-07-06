import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { assets } from "../assets/assets"
import { Menu, X } from "lucide-react"
import Sidebar from "../components/Sidebar"
import { SignIn, useUser } from "@clerk/react"

const Layout = () => {

    const navigate = useNavigate()
    const [sidebar, setSidebar] = useState(false)
    const { user } = useUser()

    return user ? (

        <div className="h-screen bg-[#0B1120] text-white overflow-hidden">

            {/* Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-14 px-8 flex items-center justify-between bg-[#111827] border-b border-slate-700">

                <img
                    src={assets.logo}
                    alt="Quick.ai"
                    onClick={() => navigate("/")}
                    className="w-36 cursor-pointer"
                />

                {sidebar ? (
                    <X
                        onClick={() => setSidebar(false)}
                        className="w-6 h-6 text-white sm:hidden cursor-pointer"
                    />
                ) : (
                    <Menu
                        onClick={() => setSidebar(true)}
                        className="w-6 h-6 text-white sm:hidden cursor-pointer"
                    />
                )}

            </nav>

            {/* Sidebar */}
            <Sidebar
                sidebar={sidebar}
                setSidebar={setSidebar}
            />

            {/* Main Content */}
            <main className="pt-14 sm:ml-56 h-screen overflow-y-auto bg-[#0B1120]">

                <div className="p-8 min-h-[calc(100vh-56px)]">

                    <Outlet />

                </div>

            </main>

        </div>

    ) : (

        <div className="flex items-center justify-center h-screen bg-[#0B1120]">

            <SignIn />

        </div>

    )

}

export default Layout