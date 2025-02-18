// "use client";

// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";

// interface Student {
//   id: number;
//   userId: number;
//   firstName: string;
//   fathersName: string;
//   licenseType: string | null;
//   Users: {
//     id: number;
//     Station: {
//       station: string;
//     };
//   };
// }

// interface LegalBusiness {
//   id: number;
//   userId: number;
//   legalBusinessName: string;
//   region: string;
//   students: Student[];
// }

// const fetchStudents = async () => {
//   const { data } = await axios.get(
//     "http://localhost:5053/api/analytics/schools"
//   );
//   return data.data;
// };

// export default function AllStudents() {
//   const { data, error, isLoading } = useQuery<LegalBusiness[]>({
//     queryKey: ["students"],
//     queryFn: fetchStudents,
//   });

//   if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
//   if (error)
//     return <p className="text-center text-red-500">Error loading schools</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4 text-center">Students</h1>
//       {data?.length === 0 ? (
//         <p className="text-center text-gray-500">No students found.</p>
//       ) : (
//         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           {data.schools.map((school) => (
//             <div
//               key={school.id}
//               className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
//             >
//               <p className="text-lg font-semibold">
//                 {school.legalBusinessName}
//               </p>
//               <p className="text-gray-600">{school.region}</p>
//               <div className="mt-4">
//                 {school.students.length > 0 ? (
//                   school.students.map((student) => (
//                     <div
//                       key={student.id}
//                       className="flex border-b py-2 text-gray-700"
//                     >
//                       <p className="font-semibold">
//                         {student.firstName} {student.fathersName}
//                       </p>
//                       <p>License Type: {student.licenseType || "N/A"}</p>
//                       <p>Station: {student.Users?.Station?.station}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <p className="text-gray-500">No students available</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

interface Student {
  id: number;
  userId: number;
  firstName: string;
  fathersName: string;
  licenseType: string | null;
  Users: {
    id: number;
    Station: {
      station: string;
    };
  };
  DrivingExamResult: [
    {
      result: string;
    }
  ];
  ComputerExamResult: [
    {
      result: string;
    }
  ];
}

interface LegalBusiness {
  id: number;
  userId: number;
  legalBusinessName: string;
  region: string;
  students: Student[];
}

const fetchStudents = async () => {
  const { data } = await axios.get(
    "http://localhost:5053/api/analytics/schools"
  );
  return data.data;
};

export default function AllStudents() {
  const { data, error, isLoading } = useQuery<LegalBusiness[]>({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const [selectedSchool, setSelectedSchool] = useState<LegalBusiness | null>(
    null
  );

  if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error)
    return <p className="text-center text-red-500">Error loading schools</p>;

  const closeModal = () => setSelectedSchool(null);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Schools</h1>
      {data?.length === 0 ? (
        <p className="text-center text-gray-500">No schools found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data?.map((school) => (
            <div
              key={school.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200 cursor-pointer"
              onClick={() => setSelectedSchool(school)}
            >
              <p className="text-lg font-semibold">
                {school.legalBusinessName}
              </p>
              <p className="text-gray-600">{school.region}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal for showing students */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-3/4 max-w-4xl p-6 relative">
            <button
              className="absolute top-2 right-2 text-xl text-gray-500"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-2xl font-semibold mb-4">
              {selectedSchool.legalBusinessName} - Students
            </h2>
            <p className="text-gray-600 mb-4">{selectedSchool.region}</p>

            {/* Students Table */}
            <div className="overflow-x-auto max-h-96">
              <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-2 border">First Name</th>
                    <th className="px-4 py-2 border">Father's Name</th>
                    <th className="px-4 py-2 border">License Type</th>
                    <th className="px-4 py-2 border">Station</th>
                    <th className="px-4 py-2 border">Driving Exam Result</th>
                    <th className="px-4 py-2 border">Computer Exam Result</th>
                  </tr>
                </thead>
                <tbody className="overflow-y-auto">
                  {selectedSchool.students.length > 0 ? (
                    selectedSchool.students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-4 py-2 border">
                          {student.firstName}
                        </td>
                        <td className="px-4 py-2 border">
                          {student.fathersName}
                        </td>
                        <td className="px-4 py-2 border">
                          {student.licenseType || "N/A"}
                        </td>
                        <td className="px-4 py-2 border">
                          {student.Users?.Station?.station}
                        </td>
                        <td className="px-4 py-2 border">
                          {student.DrivingExamResult[0]?.result || "N/A"}
                        </td>
                        <td className="px-4 py-2 border">
                          {student.ComputerExamResult[0]?.result || "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center px-4 py-2 border text-gray-500"
                      >
                        No students available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
