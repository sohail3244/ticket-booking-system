export default function Counter({ text, onClick }) {
    return (
        <button onClick={onClick} className={`w-10 h-10 rounded-full  text-xl flex items-center justify-center transition-transform active:scale-90  bg-orange-400 text-white border-orange-700 hover:bg-orange-500`}>
            {text}
        </button>
    )
}