import { BiSolidImageAdd } from "react-icons/bi";
import { FaUserTie } from "react-icons/fa"
import { RiUser5Fill } from "react-icons/ri"
import { FaCircleArrowRight } from "react-icons/fa6";
import { Form, Link, useSubmit } from "react-router-dom";
import toast from 'react-hot-toast';
import userImg from "../../assets/user.jpeg"
import axios from "axios";
import { useContext } from "react";
import { authContext } from "../../utils/AuthProvider";

function UpdateProfile() {

    const submit = useSubmit()
    const { setRemember } = useContext(authContext)
    const error = (msg) => toast.error(msg, { position: "top-right" });

    const handleSubmit = async (e) => {

        e.preventDefault();

        let formAlright = true;
        const name = e.target.name;
        const image = e.target.image;
        const fileType = image?.files[0]?.type;
        const role = e.target.role;

        if (!name.value) {
            error("plz enter a name")
            name.parentElement.style.outline = "2px solid #f87171"
            formAlright = false;
        }
        else { name.parentElement.style.outline = "" }

        if (image.value) {

            if (fileType?.split("/")[0] !== "image") {
                error("plz select an image file !")
                image.parentElement.style.outline = "2px solid #f87171"
                formAlright = false;
            }
            else { image.parentElement.style.outline = "" }
        }

        if (!role.value) {
            error("plz select a role")
            role.forEach(el => {
                el.parentElement.style.outline = "2px solid #f87171"
            })
            formAlright = false;
        }
        else {
            role.forEach(el => {
                el.parentElement.style.outline = ""
            })
        }

        if (formAlright) {

            const formData = new FormData(e.target)

            if (image.value) {

                try {
                    const result = await axios.postForm(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_ImgbbAPI}`, {
                        image: image.files[0]
                    })

                    formData.append("imageUrl", result.data.data.display_url)
                    formData.append("imgDeleteUrl", result.data.data.delete_url)
                    console.log(result.data.data)
                }
                catch {
                    return error("image upload failed, plz try again")
                }
            }

            formData.delete("image")
            submit(formData, { method: "post" })
        }
    }

    const changeHandler = (e) => {
        if (e.target.checked) {

            if (!localStorage.getItem("remember")) {
                setRemember(true)
                localStorage.setItem("remember", true)
            }
        }
        else {

            if (localStorage.getItem("remember")) {
                setRemember(false)
                localStorage.removeItem("remember")
            }
        }
    }

    return (
        <>
            <Form className="space-y-4 max-w-[600px] mx-4 md:mx-auto my-20 p-4 md:p-10 bg-teal-900 border-emerald-800 rounded-box" onSubmit={handleSubmit} noValidate method="post">

                <img src={userImg} alt="" className="w-40 h-40 rounded-full object-cover mx-auto" />

                <p className="flex items-center justify-center gap-2 text-2xl font-extrabold pb-4 text-center">Update Your Profile</p>

                <label className="input input-bordered flex items-center gap-3 bg-teal-600 focus-within:outline-teal-500/50">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70 scale-150">
                        <path
                            d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                    </svg>
                    <input type="text" name="name" className="grow placeholder:text-white" placeholder="Username" spellCheck="false" />
                </label>

                <label className="input input-bordered flex items-center bg-teal-600 focus-within:outline-teal-500/50">
                    <BiSolidImageAdd className="text-2xl scale-110 opacity-70 -ml-[3px]" />

                    <input type="file" name="image" className="file-input file-input-ghost w-full -ml-2 focus:text-white" accept="image/*" />
                </label>

                <label className="user-type flex items-center gap-3" >
                    <RiUser5Fill className="text-xl opacity-70 -ml-4 scale-110" /> I am a customer
                    <input className="hidden" type="radio" name="role" value="customer" defaultChecked />
                </label>
                <label className="user-type flex items-center gap-3">
                    <FaUserTie className="text-xl opacity-70 -ml-4 scale-110" /> I am a vendor
                    <input className="hidden" type="radio" name="role" value="vendor" />
                </label>

                <button className="flex items-center justify-center gap-2 bg-teal-500 w-full p-3 rounded-lg font-bold  hover:bg-teal-500/80 btn btn-ghost" type="submit">
                    UPDATE
                    <FaCircleArrowRight />
                </button>

                <div className="flex items-center justify-between text-sm select-none">
                    <label className="inline-flex items-center gap-1 cursor-pointer" onChange={changeHandler}>
                        <input type="checkbox" defaultChecked={localStorage.getItem("remember") === "true"} className="[--chkbg:#14b8a6] border-teal-500 checkbox mr-1 scale-90" />
                        Remember me
                    </label>
                    <Link className="hover:text-teal-400" to="/forgot-password">Forgot password ?</Link>
                </div>

            </Form>
        </>
    )
}

export default UpdateProfile