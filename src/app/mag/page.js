import { articles } from "@/__mocks__";
import { ArticleCard } from "@/components/cards";
import { MagnifyingGlass } from "@/lib/icons/svg";
import { MagCategoriesSlider } from "@/components/sliders";

const MagHomePage = () => {
    return (
        <main className="w-full py-5 md:py-14 flex flex-col gap-10 md:gap-14 overflow-hidden md:overflow-visible">
            <div className="w-full h-56 lg:h-96 relative flex flex-col justify-center items-center place-items-center bg-mag-landing bg-no-repeat bg-cover bg-center" data-aos="zoom-in">
                <div className="flex flex-col gap-y-1 md:gap-y-3.5 -mt-10 md:mt-0">
                    <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold" data-aos="fade-down" data-aos-delay="700">
                        هیکا مگ
                    </h1>
                    <div className="flex items-center justify-center gap-x-1 text-xs text-white font-bold" data-aos="fade-up" data-aos-delay="700">
                        <span>صفحه اصلی</span>
                        {">"}
                        <span>هیکا مگ</span>
                    </div>
                </div>
                <div className="absolute bottom-5 md:bottom-8 rounded-xl w-[300px] h-11" data-aos="zoom-out" data-aos-delay="700">
                    <input
                        type="text"
                        placeholder="عنوان مقاله را جستجو کنید..."
                        className="w-full h-full bg-transparent border border-white/30 rounded-2xl py-3.5 pr-3.5 text-white text-base placeholder:text-white placeholder:text-base"
                    />
                    <button type="button" className="absolute left-0 w-12 h-full border border-white rounded-xl">
                        <MagnifyingGlass className="m-auto" />
                    </button>
                </div>
            </div>
            <div className="w-full max-w-full lg:max-w-6xl mx-auto flex flex-col gap-10 md:gap-14">
                <MagCategoriesSlider />
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 lg:gap-12">
                    {articles.map((article, index) => (
                        <ArticleCard article={article} key={index} data-aos="fade-up" data-aos-delay={index * 150} />
                    ))}
                </div>
            </div>
        </main>
    );
};

export default MagHomePage;
