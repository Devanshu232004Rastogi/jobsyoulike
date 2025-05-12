const { PrismaClient } = require("../lib/generated/prisma/client");

const database = new PrismaClient();

const main = async () => {
  try {
    await database.category.createMany({
      data: [
        // Tech - Development
        { name: "Frontend Developer" },
        { name: "Backend Developer" },
        { name: "Full Stack Developer" },
        { name: "Java Developer" },
        { name: "Python Developer" },
        { name: "JavaScript Developer" },
        { name: ".NET Developer" },
        { name: "Golang Developer" },
        { name: "Ruby on Rails Developer" },
        { name: "PHP Developer" },
        { name: "Node.js Developer" },
        { name: "React Developer" },
        { name: "Angular Developer" },
        { name: "Vue.js Developer" },
        { name: "Next.js Developer" },
        { name: "Mobile App Developer" },
        { name: "Android Developer" },
        { name: "iOS Developer" },
        { name: "Flutter Developer" },
        { name: "React Native Developer" },

        // Tech - AI & Data
        { name: "Prompt Engineer" },
        { name: "Machine Learning Engineer" },
        { name: "AI Researcher" },
        { name: "Data Scientist" },
        { name: "Data Analyst" },
        { name: "Data Engineer" },
        { name: "Computer Vision Engineer" },
        { name: "NLP Engineer" },

        // Tech - Others
        { name: "DevOps Engineer" },
        { name: "Site Reliability Engineer" },
        { name: "Cloud Engineer" },
        { name: "AWS Cloud Engineer" },
        { name: "Azure Cloud Engineer" },
        { name: "GCP Cloud Engineer" },
        { name: "Blockchain Developer" },
        { name: "Smart Contract Developer" },
        { name: "Cybersecurity Specialist" },
        { name: "Network Engineer" },
        { name: "System Administrator" },
        { name: "Database Administrator (DBA)" },

        // Tech - Product and Design
        { name: "Product Manager" },
        { name: "Scrum Master" },
        { name: "UI/UX Designer" },
        { name: "Graphic Designer" },
        { name: "Game Developer" },
        { name: "AR/VR Developer" },

        // Tech - Others
        { name: "Technical Writer" },
        { name: "Quality Assurance (QA) Engineer" },
        { name: "Test Automation Engineer" },
        { name: "Penetration Tester" },
        { name: "Solutions Architect" },

        // Non-Tech - Business
        { name: "Sales Manager" },
        { name: "Marketing Manager" },
        { name: "Digital Marketing Specialist" },
        { name: "Content Writer" },
        { name: "SEO Specialist" },
        { name: "Business Analyst" },
        { name: "Operations Manager" },
        { name: "Customer Success Manager" },
        { name: "Account Manager" },
        { name: "Recruiter" },
        { name: "Human Resources Manager" },

        // Non-Tech - Creative
        { name: "Copywriter" },
        { name: "Video Editor" },
        { name: "Photographer" },
        { name: "Animator" },
        { name: "Social Media Manager" },

        // Non-Tech - Finance
        { name: "Accountant" },
        { name: "Financial Analyst" },
        { name: "Investment Banker" },
        { name: "Auditor" },

        // Non-Tech - Healthcare
        { name: "Registered Nurse" },
        { name: "Medical Assistant" },
        { name: "Pharmacist" },
        { name: "Healthcare Administrator" },

        // Non-Tech - Education
        { name: "Teacher" },
        { name: "Online Tutor" },
        { name: "Instructional Designer" },

        // Non-Tech - Legal
        { name: "Lawyer" },
        { name: "Legal Assistant" },
      ],
    });
    console.log("Successfully seeded categories!");
  } catch (error) {
    console.log(`Error seeding database categories: ${error}`);
  } finally {
    await database.$disconnect();
  }
};

main();
