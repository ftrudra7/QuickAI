import { FileText, Sparkles } from "lucide-react"
import { useState } from "react"

const ReviewResume = () => {

  const [setInput] = useState(null)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
  }

  return (

    <div className="p-8">

      <div className="grid lg:grid-cols-2 gap-8">

        {/* Left Column */}

        <form
          onSubmit={onSubmitHandler}
          className="bg-[#111827] border border-slate-700 rounded-2xl p-8"
        >

          <div className="flex items-center gap-3 mb-8">

            <Sparkles className="w-6 h-6 text-[#00DA83]" />

            <h1 className="text-3xl font-bold text-white">
              Resume Review
            </h1>

          </div>

          <div>

            <p className="text-sm text-slate-300 mb-2">
              Upload Your Resume
            </p>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e)=>setInput(e.target.files[0])}
              className="w-full rounded-xl bg-[#0B1120] border border-slate-700 px-4 py-3 text-slate-300 file:bg-[#00DA83] file:text-white file:border-0 file:px-4 file:py-2 file:rounded-lg file:cursor-pointer"
              required
            />

            <p className="text-xs text-slate-500 mt-2">
              Supports PDF only
            </p>

          </div>

          <button
            type="submit"
            className="w-full mt-8 rounded-xl bg-gradient-to-r from-[#00DA83] to-[#009BB3] py-3 flex items-center justify-center gap-2 text-white font-medium hover:opacity-90 transition"
          >

            <FileText className="w-5 h-5" />

            Review Resume

          </button>

        </form>

        {/* Right Column */}

        <div className="bg-[#111827] border border-slate-700 rounded-2xl p-8 flex flex-col min-h-[650px]">

          <div className="flex items-center gap-3">

            <FileText className="w-6 h-6 text-[#00DA83]" />

            <h1 className="text-2xl font-bold text-white">
              Analysis Results
            </h1>

          </div>

          <div className="flex-1 flex justify-center items-center">

            <div className="text-center text-slate-400">

              <FileText className="w-16 h-16 mx-auto mb-5" />

              <p>
                Upload a resume and click
                <br />
                "Review Resume" to get started
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  )

}

export default ReviewResume