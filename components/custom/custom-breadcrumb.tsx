import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import { Fragment } from "react";

interface CustomBreadCrumbProps {
  breadCrumbPage: string;
  breadCrumbItem?: { link: string; label: string }[];
}

export const CustomBreadcrumb = ({
  breadCrumbPage,
  breadCrumbItem,
}: CustomBreadCrumbProps) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center justify-center">
            <Home className="w-3 h-3 mr-2" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {breadCrumbItem && (
          <>
            {breadCrumbItem.map((item, i) => (
              <Fragment key={i}>
                <BreadcrumbSeparator  />
                <BreadcrumbItem >
                  <BreadcrumbLink href={item.link}>{item.label}</BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            ))}
          </>
        )}
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{breadCrumbPage}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};