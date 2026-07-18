import { useUser, useAuth } from "@clerk/react";
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        "/api/user/get-published-creations",
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
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const imageLikeToggle = async (id) => {
    try {
      const { data } = await axios.post(
        "/api/user/toggle-like-creation",
        { id },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchCreations();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCreations();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 text-center text-white">
        Loading community creations...
      </div>
    );
  }
    return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        Community Creations
      </h1>

      {creations.length === 0 ? (
        <div className="text-slate-400 text-center mt-20">
          No community creations yet.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {creations.map((creation) => (
            <div
              key={creation._id || creation.id}
              className="relative overflow-hidden rounded-2xl border border-slate-700 bg-[#111827] group"
            >
              <img
                src={creation.content}
                alt={creation.prompt}
                className="w-full h-80 object-cover"
              />

              <div className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition">

                <p className="text-white text-sm mb-3 line-clamp-3">
                  {creation.prompt}
                </p>

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-2">
                    <Heart
                      onClick={() =>
                        imageLikeToggle(creation._id || creation.id)
                      }
                      className={`w-5 h-5 cursor-pointer transition hover:scale-110 ${
                        creation.likes?.includes(user?.id)
                          ? "fill-red-600 text-red-600"
                          : "text-white"
                      }`}
                    />

                    <span className="text-white text-sm">
                      {creation.likes?.length || 0}
                    </span>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Community;