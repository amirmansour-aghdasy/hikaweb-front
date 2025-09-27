import { FaqOutlined } from "@/lib/icons/svg";
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";

const FaqsSection = ({ faqs }) => {
    return (
        <section id="faqs-section" className="w-full flex flex-col items-center">
            <h4 className="w-auto inline-flex gap-4 items-center justify-between rounded-xl text-base md:text-lg relative font-bold text-center p-2 text-white bg-[#005756]" data-aos="fade-left">
                شاید اینا سوالت باشه
                <FaqOutlined />
            </h4>
            <div className="w-full md:max-w-4xl mx-auto mt-5 md:mt-10 flex flex-col gap-y-3">
                {faqs.map(({ question, answer }, index) => (
                    <Disclosure as="div" className="shadow-inner bg-[#F4F4F4] rounded-xl" defaultOpen={index === 0 ? true : false} key={index} data-aos="fade-up" data-aos-delay={index * 150}>
                        <DisclosureButton className="bg-[#A5D1D1] rounded-xl py-2.5 md:py-3 px-3 text-sm md:text-base">{question}</DisclosureButton>
                        <DisclosurePanel className="p-3 text-xs md:text-sm text-[#0E443C] leading-6">{answer}</DisclosurePanel>
                    </Disclosure>
                ))}
            </div>
        </section>
    );
};

export default FaqsSection;
