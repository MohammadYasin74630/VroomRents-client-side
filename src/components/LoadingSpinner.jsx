
function LoadingSpinner(size) {
    return (
        <span className={`loading loading-spinner loading-${size || "xs"}`}></span>
    )
}

export default LoadingSpinner