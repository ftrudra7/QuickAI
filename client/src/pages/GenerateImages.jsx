import { Image, Sparkles } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/react";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const { getToken } = useAuth();

  const imageStyle = [
    "Realistic",
    "Ghibli",
    "Anime",
    "Cartoon",
    "Fantasy",
    "3D",
    "Portrait",
    "Landscape",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const token = await getToken();

      const { data } = await axios.post(
        "/api/ai/generate-image",
        {
          prompt,
          publish,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="grid lg:grid-cols-2 gap-8">

        {/* Left Column */}

        <form
          onSubmit={onSubmitHandler}
          className="bg-[#111827] border border-slate-700 rounded-2xl p-8"
        >
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="w-6 h-6 text-[#00AD25]" />

            <h1 className="text-3xl font-bold text-white">
              AI Image Generator
            </h1>
          </div>

          <div>
            <p className="text-sm text-slate-300 mb-2">
              Describe Your Image
            </p>

            <textarea
              rows={5}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your image..."
              className="w-full rounded-xl bg-[#0B1120] border border-slate-700 px-4 py-3 text-white outline-none resize-none focus:border-green-500"
              required
            />
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-300 mb-3">
              Style
            </p>

            <div className="flex flex-wrap gap-3">
              {imageStyle.map((item) => (
                <span
                  key={item}
                  onClick={() => setSelectedStyle(item)}
                  className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition ${
                    selectedStyle === item
                      ? "bg-green-500 border-green-500 text-white"
                      : "border-slate-600 text-slate-300 hover:border-green-500"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <label className="relative inline-flex cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={publish}
                onChange={(e) => setPublish(e.target.checked)}
              />

              <div className="w-11 h-6 rounded-full bg-slate-600 peer-checked:bg-green-500 transition"></div>

              <span className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition peer-checked:translate-x-5"></span>
            </label>

            <p className="text-sm text-slate-300">
              Make this image public
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 rounded-xl bg-gradient-to-r from-[#00AD25] to-[#04FF50] py-3 flex items-center justify-center gap-2 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Image className="w-5 h-5" />
            )}

            {loading ? "Generating..." : "Generate Image"}
          </button>
        </form>

                {/* Right Column */}

        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-8 flex flex-col min-h-[650px]">
          <div className="flex items-center gap-3 mb-6">
            <Image className="w-6 h-6 text-[#00AD25]" />

            <h1 className="text-2xl font-bold text-white">
              Generated Image
            </h1>
          </div>

          {!content ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-slate-400">
                <Image className="mx-auto w-16 h-16 mb-5" />

                <p>
                  Enter a description and click
                  <br />
                  <span className="text-[#00AD25] font-medium">
                    Generate Image
                  </span>{" "}
                  to get started.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center mt-4">
              <img
                src={content}
                alt="Generated"
                className="w-full h-full rounded-xl object-cover border border-slate-700"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;