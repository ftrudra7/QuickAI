import {
    SignOutButton,
    useClerk,
    useUser
} from "@clerk/react"

import { NavLink } from "react-router-dom"

import {
    Image,
    Hash,
    House,
    SquarePen,
    Eraser,
    Square,
    FileText,
    Users,
    LogOut
} from "lucide-react"

const navItems = [
    { to: "/ai", label: "Dashboard", Icon: House },
    { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
    { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
    { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
    { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
    { to: "/ai/remove-object", label: "Remove Object", Icon: Square },
    { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
    { to: "/ai/community", label: "Community", Icon: Users }
]

const Sidebar = ({ sidebar, setSidebar }) => {

    const { user } = useUser()
    const { openUserProfile } = useClerk()
    const isPremium =
    user?.publicMetadata?.plan === "premium" ||
    user?.unsafeMetadata?.plan === "premium"

    return (

        <div
            className={`fixed top-14 left-0 h-[calc(100vh-56px)] w-56 bg-[#111827] border-r border-slate-700 flex flex-col justify-between transition-all duration-300 ${
                sidebar ? "translate-x-0" : "-translate-x-full"
            } sm:translate-x-0`}
        >

            <div>

                <div className="flex flex-col items-center py-8 border-b border-slate-700">

                    <img
                        src={user?.imageUrl}
                        alt=""
                        className="w-16 h-16 rounded-full"
                    />

                    <h1 className="mt-3 text-white font-semibold">
                        {user?.fullName}
                    </h1>

                </div>

                <div className="p-3 flex flex-col gap-2">

                    {navItems.map(({ to, label, Icon }) => (

                        <NavLink
                            key={to}
                            to={to}
                            end={to === "/ai"}
                            onClick={() => setSidebar(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3.5 py-2.5 rounded-lg transition-all ${
                                    isActive
                                        ? "bg-violet-600 text-white"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                }`
                            }
                        >

                            <Icon className="w-5 h-5" />

                            <span className="text-sm">
                                {label}
                            </span>

                        </NavLink>

                    ))}

                </div>

            </div>

            <div className="border-t border-slate-700 p-4 flex items-center justify-between">

                <div
                    onClick={() => openUserProfile()}
                    className="flex items-center gap-3 cursor-pointer"
                >

                    <img
                        src={user?.imageUrl}
                        alt=""
                        className="w-9 h-9 rounded-full"
                    />

                    <div>

                        <h2 className="text-sm text-white font-medium">
                            {user?.fullName}
                        </h2>

                        <p className={`text-xs ${isPremium
                        ? "text-violet-400"
                        : "text-slate-400"}`}
>
    {isPremium ? "Premium Plan" : "Free Plan"}
</p>

                    </div>

                </div>

                <SignOutButton>

                    <LogOut className="w-5 h-5 text-slate-400 hover:text-white cursor-pointer transition" />

                </SignOutButton>

            </div>

        </div>

    )

}

export default Sidebar 