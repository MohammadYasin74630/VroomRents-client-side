import { IoCloseCircleOutline } from "react-icons/io5"

function Dialog({ dialogRef, children }) {

    const closeDialog = () => {
        dialogRef.current.close()
    }

    const backdropClose = e => {

        if (e.currentTarget === e.target) closeDialog()
    }

    return (
        <>
            <dialog id="modalComponent" className="bg-transparent pt-4 backdrop:bg-emerald-900 backdrop:bg-opacity-50 backdrop:blur-sm z-50 overflow-x-hidden " ref={dialogRef} onClick={backdropClose}>

                <div className="border border-teal-800 relative text-white bg-emerald-900 rounded-2xl shadow-sm">

                    {
                        children
                    }

                    <button className="text-3xl text-teal-500 absolute -top-3 -right-[3px]  z-10" onClick={closeDialog}>
                        <IoCloseCircleOutline />
                    </button>

                </div>

            </dialog>
        </>
    )
}

export default Dialog