import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/custom/box";
import HomeSearchContainer from "@/components/custom/home-search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";
import BannerImg from "@/public/landingHeader.svg"
import { HomescreenCategoriesContainer } from "@/components/custom/home-screen-categories-container";
import { HomeCompaniesList } from "@/components/custom/home-companies-list";
import { RecommendedJobsList } from "@/components/custom/recommended-jobs-list";
import { Footer } from "@/components/custom/footer";

const DashboardHomePage = async () => {
  const { userId } = await auth();
  const jobs = await getJobs({});

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await db.company.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-col py-6 px-4 space-y-24">
      <Box className="flex-col w-full space-y-4 mt-12">
        <h2 className="text-2xl md:text-4xl tracking-wide text-foreground-600 font-sans font-bold">
          Find your dream job now
        </h2>
        <p className="text-2xl text-muted-foreground">
          {jobs.length} jobs for you to explore
        </p>
      </Box>
      <HomeSearchContainer />
      <Box className="overflow-hidden h-64 justify-center rounded-lg mt-12">
        <Image
          src={BannerImg}
          
          alt="Home Banner"
          
          
          
          className="object-cover w-full h-full"
        />
      </Box>

      <HomescreenCategoriesContainer categories={categories}/>
      <HomeCompaniesList companies={companies}/>
      <RecommendedJobsList jobs={jobs.splice(0,3)} userId= {userId}/>
      <Footer />
    </div>
  );
};

export default DashboardHomePage;
