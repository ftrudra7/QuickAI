import { useState } from "react"
import {
  Sparkles,
  Clock3,
  Heart,
  Image as ImageIcon,
  PenSquare
} from "lucide-react"

import { dummyCreationData } from "../assets/assets"

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
    (sum, item) => sum + item.likes.length,
    0
  )

  return (

    <div className="flex-1 overflow-y-auto p-8 bg-[#0B1120] min-h-screen">

      {/* Heading */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back, here's an overview of your AI creations.
        </p>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

        {/* Total */}

        <div className="bg-[#111827] rounded-2xl border border-slate-700 p-6 flex justify-between">

          <div>

            <p className="text-slate-400 text-sm">
              Total Creations
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {totalCreations}
            </h2>

          </div>

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#6D5DFE] to-[#9D4EDD] flex items-center justify-center">

            <Sparkles className="text-white w-7 h-7" />

          </div>

        </div>

        {/* Articles */}

        <div className="bg-[#111827] rounded-2xl border border-slate-700 p-6 flex justify-between">

          <div>

            <p className="text-slate-400 text-sm">
              Articles
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {totalArticles}
            </h2>

          </div>

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] flex items-center justify-center">

            <PenSquare className="text-white w-7 h-7"/>

          </div>

        </div>

        {/* Images */}

        <div className="bg-[#111827] rounded-2xl border border-slate-700 p-6 flex justify-between">

          <div>

            <p className="text-slate-400 text-sm">
              Images
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {totalImages}
            </h2>

          </div>

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#20C363] to-[#11B97E] flex items-center justify-center">

            <ImageIcon className="text-white w-7 h-7"/>

          </div>

        </div>

        {/* Likes */}

        <div className="bg-[#111827] rounded-2xl border border-slate-700 p-6 flex justify-between">

          <div>

            <p className="text-slate-400 text-sm">
              Total Likes
            </p>

            <h2 className="text-3xl font-bold text-white mt-2">
              {totalLikes}
            </h2>

          </div>

          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E549A3] to-[#B153EA] flex items-center justify-center">

            <Heart className="text-white w-7 h-7"/>

          </div>

        </div>

      </div>

      {/* Recent Creations */}

      <div className="mt-10 bg-[#111827] border border-slate-700 rounded-2xl overflow-hidden">

        <div className="flex justify-between items-center p-6 border-b border-slate-700">

          <h2 className="text-xl font-semibold text-white">

            Recent Creations

          </h2>

          <Clock3 className="text-slate-400"/>

        </div>

        <div>

          {creations.map((item) => (

            <div

              key={item.id}

              className="flex justify-between items-center px-6 py-5 border-b border-slate-800 hover:bg-slate-800 transition"

            >

              <div>

                <h3 className="text-white font-medium">

                  {item.prompt}

                </h3>

                <p className="text-sm text-slate-400 capitalize mt-1">

                  {item.type}

                </p>

              </div>

              <div className="flex items-center gap-3">

                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.publish
                    ? "bg-green-600/20 text-green-400"
                    : "bg-yellow-600/20 text-yellow-400"
                }`}>

                  {item.publish ? "Published" : "Draft"}

                </span>

              </div>

            </div>

          ))}

        </div>

      </div>

      {/* Quick Overview */}

      <div className="mt-10 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-8">

        <h2 className="text-2xl font-bold text-white">

          Keep Creating 🚀

        </h2>

        <p className="text-violet-100 mt-3 max-w-xl">

          Explore all AI tools from the sidebar and continue generating
          articles, blog titles, AI images, resumes and much more.

        </p>

      </div>

    </div>

  )

}

export default Dashboard