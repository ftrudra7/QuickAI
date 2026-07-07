import { useUser } from "@clerk/react"
import { useEffect, useState } from "react"
import { dummyPublishedCreationData } from "../assets/assets"
import { Heart } from "lucide-react"

const Community = () => {

  const [creations, setCreations] = useState([])
  const { user } = useUser()

  const fetchCreations = async () => {
    setCreations(dummyPublishedCreationData)
  }

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  return (

    <div className="p-8">

      <h1 className="text-3xl font-bold text-white mb-8">
        Community Creations
      </h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {creations.map((creation, index) => (

          <div
            key={index}
            className="relative overflow-hidden rounded-2xl border border-slate-700 bg-[#111827] group"
          >

            <img
              src={creation.content}
              alt=""
              className="w-full h-80 object-cover"
            />

            <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition">

              <p className="text-white text-sm mb-3">
                {creation.prompt}
              </p>

              <div className="flex items-center gap-2">

                <p className="text-white">
                  {creation.likes.length}
                </p>

                <Heart
                  className={`w-5 h-5 cursor-pointer transition hover:scale-110 ${
                    creation.likes.includes(user?.id)
                      ? "fill-red-600 text-red-600"
                      : "text-white"
                  }`}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}

export default Community