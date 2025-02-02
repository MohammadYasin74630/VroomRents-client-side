import toast from "react-hot-toast";
import { IoCloseCircleSharp } from "react-icons/io5";

function FeatureInput({ features, setFeatures, btnLoading }) {

  const error = (msg) => toast.error(msg, { position: "top-right" });

  const handleFeatures = (e) => {

    const value = e.target.value.replace(/\n/g, "").trim();

    if (e.key === "Enter" && value !== "") {

      if (!features.includes(value)) {
        setFeatures([...features, value])
        e.target.value = ""
      } else {
        e.target.value = e.target.value.trim()
        error("feature added already !")
      }

    }
  }

  return (
    <div className={`w-full bg-teal-700 focus-within:bg-emerald-950 focus-within:outline focus-within:outline-teal-500/50 outline-2 p-[1.5px] rounded-lg h-min`}>

      <div className={`textarea [font-size:_1rem] bg-teal-600 flex flex-wrap pr-0 py-0 focus-within:border-teal-700 focus-within:overflow-hidden ${btnLoading ? "cursor-not-allowed" : null}`} spellCheck={false}>

        {
          features.map(
            (itm, idx) => <div className={`h-max inline-flex items-center gap-1 bg-emerald-800 px-2 rounded-md mr-2 mt-2 ${btnLoading ? "pointer-events-none" : null}`} key={idx}>
              <span>{itm}</span>
              <IoCloseCircleSharp className={`text-xl ${btnLoading ? "cursor-not-allowed" : "cursor-pointer"}`} onClick={() => setFeatures(prev => (prev.filter(feature => feature !== itm)))} />
            </div>
          )
        }

        <textarea
          rows={1}
          placeholder="Car Features"
          name="features"
          spellCheck={false}
          className={`bg-teal-600 focus-within:outline-none placeholder:text-white min-w-7 min-h-10 flex-grow mt-2 pb-2 ${btnLoading ? "cursor-not-allowed" : null}`}
          onKeyUp={handleFeatures}></textarea>

      </div>

    </div>
  )
}

export default FeatureInput