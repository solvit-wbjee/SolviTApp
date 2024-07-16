"use client";
import React from "react";
import Heading from "../utils/Heading";
import AdminSidebar from "../components/Admin/Sidebar/AdminSidebar";
import DashboardHero from "../components/Admin/DashboardHero";

type Props = {};

function page({}: Props) {
  return (
    <div>
      <Heading
        title="SolviT - Admin"
        description="SolviT is a platform for students to learn and get help from teachers"
        keywords="Wbjee,NEET,Gate,Exam"
      />
      <div className="flex min-h-screen">
        <div className="1500px:w-[16%] w-1/5">
          <AdminSidebar />
        </div>
        <div className="w-[85%]">
          <DashboardHero isDashboard={true} />
        </div>
      </div>
    </div>
  );
}

export default page;
