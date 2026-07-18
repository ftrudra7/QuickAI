import { Hash, Sparkles } from "lucide-react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { useAuth } from "@clerk/react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const { getToken } = useAuth();

  const blogCategories = [
    "General",
    "Technology",
    "Business",
    "Health",
    "Lifestyle",
    "Education",
    "Travel",
    "Food",
  ];

  const [selectedCategory, setSelectedCategory] = useState("General");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const prompt = `Generate 10 SEO-friendly blog titles for the keyword "${input}" in the category "${selectedCategory}".

Requirements:
- Return only the titles.
- Number each title.
- Make them catchy and clickable.
- Use Markdown formatting.
- No explanations.`;

      const token = await getToken();

      const { data } = await axios.post(
        "/api/ai/generate-blog-title",
        { prompt },
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
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Left Column */}

      <form
        onSubmit={onSubmitHandler}
        className="flex-1 bg-[#111827] border border-slate-700 rounded-2xl p-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="w-6 h-6 text-[#8E37EB]" />

          <h1 className="text-2xl font-bold text-white">
            AI Title Generator
          </h1>
        </div>

        <div className="mb-6">
          <p className="text-sm text-slate-300 mb-2">
            Keyword
          </p>

          <input
            type="text"
            required
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="The future of Artificial Intelligence..."
            className="w-full bg-[#0B1120] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-[#8E37EB]"
          />
        </div>

        <div>
          <p className="text-sm text-slate-300 mb-3">
            Category
          </p>

          <div className="flex flex-wrap gap-3">
            {blogCategories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSelectedCategory(item)}
                className={`px-4 py-2 rounded-full border transition ${
                  selectedCategory === item
                    ? "bg-[#8E37EB] border-[#8E37EB] text-white"
                    : "border-slate-600 text-slate-300 hover:border-[#8E37EB]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full mt-10 flex justify-center items-center gap-3 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] py-3 rounded-xl text-white font-medium hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Hash className="w-5 h-5" />
          )}

          {loading ? "Generating..." : "Generate Title"}
        </button>
      </form>

      {/* Right Column */}

      <div className="flex-1 bg-[#111827] border border-slate-700 rounded-2xl p-6 min-h-[550px]">
        <div className="flex items-center gap-3 mb-6">
          <Hash className="w-6 h-6 text-[#8E37EB]" />

          <h1 className="text-2xl font-bold text-white">
            Generated Titles
          </h1>
        </div>

        {!content ? (
          <div className="flex justify-center items-center h-[420px] text-slate-400">
            <div className="text-center">
              <Hash className="w-10 h-10 mx-auto mb-4" />

              <p>
                Enter a topic and click
                <br />
                <span className="text-[#C341F6]">
                  Generate Title
                </span>{" "}
                to get started.
              </p>
            </div>
          </div>
        ) : (
          <div className="prose prose-invert max-w-none text-slate-300 overflow-y-auto h-[420px]">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogTitles;