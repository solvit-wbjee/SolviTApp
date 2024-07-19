import {
  useEditLayoutMutation,
  useGetHeroDataQuery,
} from "@/redux/features/layout/layoutApi";
import React, { useEffect, useState } from "react";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io";
import { toast } from "react-hot-toast";

type Props = {};

const EditYear = (props: Props) => {
  const { data, isLoading, refetch } = useGetHeroDataQuery("Courseyear", {
    refetchOnMountOrArgChange: true,
  });
  const [editLayout, { isSuccess: layoutSuccess, error }] =
    useEditLayoutMutation();
  const [courseyear, setCourseyear] = useState<any>([]);

  useEffect(() => {
    if (data) {
      setCourseyear(data.layout?.courseyear);
    }
    if (layoutSuccess) {
      refetch();
      toast.success("Courseyear updated successfully");
    }

    if (error) {
      if ("data" in error) {
        const errorData = error as any;
        toast.error(errorData?.data?.message);
      }
    }
  }, [data, layoutSuccess, error, refetch]);

  const handleCourseyearAdd = (id: any, value: string) => {
    setCourseyear((prevCourseyear: any) =>
      prevCourseyear.map((i: any) =>
        i._id === id ? { ...i, title: value } : i
      )
    );
  };

  const newCourseyearHandler = () => {
    if (courseyear[courseyear.length - 1].title === "") {
      toast.error("Courseyear title cannot be empty");
    } else {
      setCourseyear((prevCourseyear: any) => [
        ...prevCourseyear,
        { title: "" },
      ]);
    }
  };

  const areCourseyearUnchanged = (
    originalCourseyear: any[],
    newCourseyear: any[]
  ) => {
    return JSON.stringify(originalCourseyear) === JSON.stringify(newCourseyear);
  };

  const isAnyCourseyearTitleEmpty = (courseyear: any[]) => {
    return courseyear.some((q) => q.title === "");
  };

  const editCourseyearHandler = async () => {
    if (
      !areCourseyearUnchanged(data.layout?.courseyear, courseyear) &&
      !isAnyCourseyearTitleEmpty(courseyear)
    ) {
      await editLayout({
        type: "Courseyear",
        courseyear: courseyear,
      });
    }
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="mt-[120px] text-center">
          <h1 className={`${styles.title}`}>Course years</h1>
          {courseyear &&
            courseyear.map((item: any, index: number) => {
              return (
                <div className="p-3" key={index}>
                  <div className="flex items-center w-full justify-center">
                    <input
                      className={`${styles.input} !w-[unset] !border-none !text-[20px]`}
                      value={item.title}
                      onChange={(e) =>
                        handleCourseyearAdd(item._id, e.target.value)
                      }
                      placeholder="Enter Course year..."
                    />
                    <AiOutlineDelete
                      className="dark:text-white text-black text-[18px] cursor-pointer"
                      onClick={() => {
                        setCourseyear((prevCourseyear: any) =>
                          prevCourseyear.filter((i: any) => i._id !== item._id)
                        );
                      }}
                    />
                  </div>
                </div>
              );
            })}
          <br />
          <br />
          <div className="w-full flex justify-center">
            <IoMdAddCircleOutline
              className="dark:text-white text-black text-[25px] cursor-pointer"
              onClick={newCourseyearHandler}
            />
          </div>
          <div
            className={`${
              styles.button
            } !w-[100px] !min-h-[40px] !h-[40px] dark:text-white text-black bg-[#cccccc34] 
              ${
                areCourseyearUnchanged(data.layout?.courseyear, courseyear) ||
                isAnyCourseyearTitleEmpty(courseyear)
                  ? "!cursor-not-allowed"
                  : "!cursor-pointer !bg-[#42d383]"
              }
              !rounded absolute bottom-12 right-12`}
            onClick={
              areCourseyearUnchanged(data.layout?.courseyear, courseyear) ||
              isAnyCourseyearTitleEmpty(courseyear)
                ? () => null
                : editCourseyearHandler
            }
          >
            Save
          </div>
        </div>
      )}
    </>
  );
};

export default EditYear;
