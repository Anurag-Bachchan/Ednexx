import { useDispatch, useSelector } from "react-redux";
import { Table, Tbody, Td, Th, Thead, Tr } from "react-super-responsive-table";
// import { getUserEnrolledCourses } from "../../Services/operations/profileAPI"
// import {
//   setCourse,
//   setEditCourse,
// } from "../../../../slices/courseSlice";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

import { formatDate } from "../../Services/formatDate";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../Services/operations/courseDetailAPI";
import ConfirmationModal from "../../common/ConfirmModal";
// import { convertSecondsToDuration } from "../../../../utils/secToDuration";


export default function CoursesTable({ courses, setCourses }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  

  const TRUNCATE_LENGTH = 30;
  

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse(courseId, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };
  

  return (
    <>
      <Table className="rounded-xl border border-slate-500 ">
        <Thead>
          <Tr className="flex flex-col md:flex-row gap-x-10 rounded-t-md border-b border-b-slate-500 bg-slate-900 px-6 py-2">
            <Th className="flex-1 text-left text-sm font-medium uppercase text-slate-200">
              Courses
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-slate-200">
              Duration
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-slate-200">
              Price
            </Th>
            <Th className="text-left text-sm font-medium uppercase text-slate-200">
              Actions
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {courses?.length === 0 ? (
            <Tr>
              <Td className="py-10 text-center text-2xl font-medium text-slate-200">
                No courses found
              </Td>
            </Tr>
          ) : (
            courses?.map((course) => (
              <Tr
                key={course._id}
                className="flex flex-col md:flex-row gap-x-10 border-b border-slate-500 px-6 py-8"
              >
                <Td className="flex-1 md:w-1/3">
                  <div className="flex flex-col md:flex-row gap-x-4">
                    <img
                      src={course?.thumbnail}
                      alt={course?.courseName}
                      className="h-[148px] w-full md:w-[220px] rounded-lg object-cover"
                    />
                    <div className="flex flex-col justify-between">
                      <p className="text-lg font-semibold text-slate-5">
                        {course.courseName}
                      </p>
                      <p className="text-xs text-slate-300">
                        {course.courseDescription.split(" ").length >
                        TRUNCATE_LENGTH
                          ? course.courseDescription
                              .split(" ")
                              .slice(0, TRUNCATE_LENGTH)
                              .join(" ") + "..."
                          : course.courseDescription}
                      </p>
                      <p className="text-[12px] text-white">
                        Created: {formatDate(course.createdAt)}
                      </p>
                      {course.status === "Draft" ? (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-slate-900 px-2 py-[2px] text-[12px] font-medium text-pink-200">
                          <HiClock size={14} />
                          Drafted
                        </p>
                      ) : (
                        <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-slate-900 px-2 py-[2px] text-[12px] font-medium text-yellow-200">
                          <div className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-200 text-slate-900">
                            <FaCheck size={8} />
                          </div>
                          Published
                        </p>
                      )}
                    </div>
                  </div>
                </Td>
                <Td className="text-sm font-medium text-slate-200">
                  1 Hr
                  {/* {course?.courseContent?.reduce((acc, sec) => {
                    sec?.subSection?.forEach(sub => {
                      acc += parseFloat(sub?.timeDuration) || 11;
                    });
                    return convertSecondsToDuration(acc);
                  }, 0)} */}
         


                </Td>
                <Td className="text-sm font-medium text-slate-200">
                  ₹{course.price}
                </Td>
                <Td className="text-sm font-medium text-slate-200 flex gap-x-2">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...  ",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </Table>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
}