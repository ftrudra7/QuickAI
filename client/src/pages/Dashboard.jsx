import { useEffect, useState } from "react";
import {
  Sparkles,
  Clock3,
  Heart,
  Image as ImageIcon,
  PenSquare,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/react";
import CreationItem from "../components/CreationItem";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const { getToken } = useAuth();

  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDashboardData = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "/api/user/get-user-creations",
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        setCreations(data.creations || []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const totalCreations = creations.length;

  const totalArticles = creations.filter(
    (item) => item.type === "article"
  ).length;

  const totalImages = creations.filter(
    (item) => item.type === "image"
  ).length;

  const totalLikes = creations.reduce(
    (sum, item) => sum + (item.likes?.length || 0),
    0
  );
    return (
    <div className="w-full min-h-screen bg-[#0B1120] p-8">

      {/* Heading */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back! Here's an overview of your AI creations.
        </p>
      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

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

        {loading ? (

          <div className="flex justify-center items-center py-20">

            <div className="animate-spin rounded-full h-12 w-12 border-4 border-violet-500 border-t-transparent"></div>

          </div>

        ) : creations.length > 0 ? (

          <div>

            {creations.map((item) => (

              <CreationItem
                key={item._id || item.id}
                item={item}
              />

            ))}

          </div>

        ) : (

          <div className="py-16 text-center text-slate-400">

            No creations found.

          </div>

        )}

      </div>

      {/* Banner */}

      <div className="mt-10 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-8">

        <h2 className="text-2xl font-bold text-white">
          Keep Creating 🚀
        </h2>

        <p className="text-violet-100 mt-3 max-w-2xl">

          Explore all AI tools from the sidebar and continue creating
          articles, blog titles, AI images, resumes and much more.

        </p>

      </div>

    </div>
  );
};

export default Dashboard;