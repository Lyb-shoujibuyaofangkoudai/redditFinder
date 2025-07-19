"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const Footer = () => {
  return (
    <>
      <footer className="border-t border-stroke bg-white dark:border-strokedark dark:bg-blacksection">
        <div className="mx-auto max-w-c-1390 px-4 md:px-8 2xl:px-0">
          {/* <!-- Footer Top --> */}
          <div className="py-20 lg:py-25">
            <div className="flex flex-wrap gap-8 lg:justify-between lg:gap-0">
              <motion.div
                variants={{
                  hidden: {
                    opacity: 0,
                    y: -20,
                  },

                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
                initial="hidden"
                whileInView="visible"
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
                className="animate_top w-1/2 lg:w-1/4"
              >
                <a href="/" className="relative flex items-center gap-5">
                  <Image
                    width={60}
                    height={60}
                    src="/images/logo/logo.svg"
                    alt="Logo"
                    className="dark:hidden"
                  />
                  <Image
                    width={60}
                    height={60}
                    src="/images/logo/logo.svg"
                    alt="Logo"
                    className="hidden dark:block"
                  />
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent">
                    Reddit Finder
                  </span>
                </a>

                <p className="mb-10 mt-5">
                  Obtain relevant post information through the Reddit platform and use AI analysis to search and analyze to determine the most suitable posts
                </p>

              </motion.div>

              <div className="flex w-full flex-col gap-8 md:flex-row md:justify-between md:gap-0 lg:w-2/3 xl:w-7/12">
                <motion.div
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: -20,
                    },

                    visible: {
                      opacity: 1,
                      y: 0,
                    },
                  }}
                  initial="hidden"
                  whileInView="visible"
                  transition={{ duration: 1, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="animate_top"
                >
                  <h4 className="mb-9 text-itemtitle2 font-medium text-black dark:text-white">
                    Other
                  </h4>

                </motion.div>


              </div>
            </div>
          </div>
  
        </div>
      </footer>
    </>
  );
};

export default Footer;
