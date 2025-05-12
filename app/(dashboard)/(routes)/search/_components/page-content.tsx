"use client";

import { Job } from "@/lib/generated/prisma";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
// import { fadeInOut } from "@/animations";
import JobCardItem from "./job-card-items";
interface PageContentProps {
  jobs: Job[];
  userId: string | null;
}

export const PageContent = ({ jobs, userId }: PageContentProps) => {
  const fadeInOut = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 },
};
  if (jobs.length === 0) {
    return (
      <div className=" flex items-center justify-center flex-col">
        <div className="w-full h-[60vh] relative flex items-center justify-center">
          <Image
            fill
            src={"404.svg"}
            alt="Not Found"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    );
  }
  return (
    <div className="pt-6">
         <motion.div
        layout
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: {},
          animate: {},
          exit: {},
        }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-6 gap-2"
        >
        <AnimatePresence>
          {jobs.map((job) => (
            <motion.div
              key={job.id}
              variants={fadeInOut}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
            >
              <JobCardItem job={job} userId={userId} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
