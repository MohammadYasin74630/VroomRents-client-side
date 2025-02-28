import { IoCloseCircleOutline } from "react-icons/io5"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

function Dialog({ dialogRef, children }) {

    const [close, setClose] = useState(false)

    const closeDialog = () => {
        dialogRef.current.close()
        setClose(false)
    }

    const backdropClose = e => {
        if (e.currentTarget === e.target) {
            setClose(true)
            setTimeout(() => {
                closeDialog()
            }, 100);
        }
    }

    const dialogClose = () => {
        setClose(true)
        setTimeout(() => {
            closeDialog()
        }, 100);
    }

    useEffect(() => {
        const handleKeyDown = (e) => {
            e.preventDefault()
            if (e.key === 'Escape' && !close) {
                dialogClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [close]);

    return (
        <>
            <motion.dialog id="modalComponent" className="bg-transparent pt-4 backdrop:bg-emerald-900 backdrop:bg-opacity-50 backdrop:blur-sm z-50 overflow-x-hidden " ref={dialogRef} onClick={backdropClose}
                initial={{ scale: 0 }}
                whileInView={!close ? { scale: 1 } : { scale: 0 }}
            >

                <div className="border border-teal-800 relative text-white bg-emerald-900 rounded-2xl shadow-sm">

                    {
                        children
                    }

                    <button className="text-3xl text-teal-500 absolute -top-3 -right-[3px]  z-10" onClick={dialogClose}>
                        <IoCloseCircleOutline />
                    </button>

                </div>

            </motion.dialog>
        </>
    )
}

export default Dialog