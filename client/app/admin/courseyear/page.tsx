"use client";
import DashboardHero from "@/app/components/Admin/DashboardHero";
// import AdminProtected from "@/app/hooks/adminProtected";
import Heading from "@/app/utils/Heading";
import React from "react";
import AdminSidebar from "../../components/Admin/Sidebar/AdminSidebar";
import EditCategories from "../../components/Admin/Customization/EditCategories";
import EditYear from "../../components/Admin/Customization/EditYear";

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      {/* <AdminProtected> */}
      <Heading
        title="SolviT - Admin"
        description="SolviT is a platform for students to learn and get help from teachers"
        keywords="Programming,MERN,Redux,Machine Learning"
      />
      <div className="flex h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero />
          <EditYear />
        </div>
      </div>
      {/* </AdminProtected> */}
    </div>
  );
};

export default page;
