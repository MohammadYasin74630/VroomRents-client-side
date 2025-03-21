import { useKeenSlider } from "keen-slider/react"

function ThumbnailPlugin(mainRef) {
    return (slider) => {
        function removeActive() {
            slider.slides.forEach((slide) => {
                slide.classList.remove("active")
            })
        }
        function addActive(idx) {
            slider.slides[idx].classList.add("active")
        }

        function addClickEvents() {
            slider.slides.forEach((slide, idx) => {
                slide.addEventListener("click", () => {
                    if (mainRef.current) mainRef.current.moveToIdx(idx)
                })
            })
        }

        slider.on("created", () => {
            if (!mainRef.current) return
            addActive(slider.track.details.rel)
            addClickEvents()
            mainRef.current.on("animationStarted", (main) => {
                removeActive()
                const next = main.animator.targetIdx || 0
                addActive(main.track.absToRel(next))
                slider.moveToIdx(Math.min(slider.track.details.maxIdx, next))
            })
        })
    }
}

function ImageSlides({ images }) {

    const [sliderRef, instanceRef] = useKeenSlider({
        initial: 0,
    })

    const [thumbnailRef] = useKeenSlider(
        {
            initial: 0,
            slides: {
                perView: 4,
                spacing: 12,
            },
            vertical: true,
            breakpoints: {
                // "(min-width: 1280px)": {
                //     vertical: true,
                // },
                "(max-width: 1279px)": {
                    vertical: false,
                    slides: {
                        perView: 4,
                        spacing: 8,
                    },
                },
            },
        },
        [ThumbnailPlugin(instanceRef)]
    )

    return (
        <>
            <div className="xl:flex relative">

                <div ref={sliderRef} className="keen-slider xl:!w-5/6  shrink-0 rounded-xl">

                    {
                        images?.map(
                            (img, idx) => <div className="keen-slider__slide max-[768px]:p-4" key={idx}>
                                <img className="w-full max-h-[70vmin] object-cover rounded-xl" src={img} alt="" />
                            </div>
                        )
                    }

                </div>

                <div ref={thumbnailRef} className="keen-slider thumbnail md:py-3 max-[768px]:!w-11/12 mx-auto xl:mx-3 self-start rounded-xl max-h-[460px] flex-nowrap">

                    {
                        images?.map(
                            (img, idx) => <div className="keen-slider__slide rounded-xl xl:!min-h-14 2xl:!min-h-20" key={idx}>
                                <img className="w-full h-full object-cover" src={img} alt="" />
                            </div>
                        )
                    }

                </div>

            </div>
        </>
    )
}

export default ImageSlides