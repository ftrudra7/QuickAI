import { useState } from "react"
import {
  Sparkles,
  Clock3,
  Heart,
  Image as ImageIcon,
  PenSquare
} from "lucide-react"

import { dummyCreationData } from "../assets/assets"
import Creationitem from "../components/Creationitem"

const Dashboard = () => {

  const [creations] = useState(dummyCreationData)

  const totalCreations = creations.length

  const totalImages = creations.filter(
    item => item.type === "image"
  ).length

  const totalArticles = creations.filter(
    item => item.type === "article"
  ).length

  const totalLikes = creations.reduce(
    (sum, item) => sum + (item.likes?.length || 0),
    0
  )

  return (

    <div className="w-full min-h-screen bg-[#0B1120] p-8">

      {/* Heading */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back, here's an overview of your AI creations.
        </p>

      </div>

      {/* Statistics */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Total Creations */}

        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 flex justify-between items-center">

          <div>

            <p className="text-slate-400 text-sm">
              Total Creations
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {totalCreations}
            </h2>

          </div>

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">

            <Sparkles className="w-7 h-7 text-white" />

          </div>

        </div>

        {/* Articles */}

        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 flex justify-between items-center">

          <div>

            <p className="text-slate-400 text-sm">
              Articles
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {totalArticles}
            </h2>

          </div>

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center">

            <PenSquare className="w-7 h-7 text-white" />

          </div>

        </div>

        {/* Images */}

        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 flex justify-between items-center">

          <div>

            <p className="text-slate-400 text-sm">
              Images
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {totalImages}
            </h2>

          </div>

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">

            <ImageIcon className="w-7 h-7 text-white" />

          </div>

        </div>

        {/* Likes */}

        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-6 flex justify-between items-center">

          <div>

            <p className="text-slate-400 text-sm">
              Total Likes
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {totalLikes}
            </h2>

          </div>

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-fuchsia-500 flex items-center justify-center">

            <Heart className="w-7 h-7 text-white" />

          </div>

        </div>

      </div>

      {/* Recent Creations */}

      <div className="mt-10 bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden">

        <div className="flex justify-between items-center px-6 py-5 border-b border-slate-700">

          <h2 className="text-xl font-semibold text-white">
            Recent Creations
          </h2>

          <Clock3 className="w-5 h-5 text-slate-400" />

        </div>

        <div>

          {creations.length > 0 ? (

            creations.map((item) => (

              <Creationitem
                key={item.id}
                item={item}
              />

            ))

          ) : (

            <div className="py-16 text-center text-slate-400">

              No creations yet.

            </div>

          )}

        </div>

      </div>

      {/* Quick Banner */}

      <div className="mt-10 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8">

        <h2 className="text-2xl font-bold text-white">

          Keep Creating 🚀

        </h2>

        <p className="text-violet-100 mt-3 max-w-2xl">

          Explore all AI tools from the sidebar and continue creating
          articles, blog titles, AI images, resumes, and much more.

        </p>

      </div>

    </div>

  )

}

export default Dashboard