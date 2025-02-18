// // "use client";

// // import { useQuery } from "@tanstack/react-query";
// // import axios from "axios";

// // interface Student {
// //   id: number;
// //   userId: number;
// //   firstName: string;
// //   fathersName: string;
// //   licenseType: string | null;
// //   Users: {
// //     id: number;
// //     Station: {
// //       station: string;
// //     };
// //   };
// // }

// // interface LegalBusiness {
// //   id: number;
// //   userId: number;
// //   legalBusinessName: string;
// //   region: string;
// //   students: Student[];
// // }

// // const fetchStudents = async () => {
// //   const { data } = await axios.get(
// //     "http://localhost:5053/api/analytics/schools"
// //   );
// //   return data.data;
// // };

// // export default function Students() {
// //   const { data, error, isLoading } = useQuery<Student[]>({
// //     queryKey: ["students"],
// //     queryFn: fetchStudents,
// //   });

// //   if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
// //   if (error)
// //     return <p className="text-center text-red-500">Error loading schools</p>;

// //   return (
// //     <div className="p-6">
// //       <h1 className="text-2xl font-bold mb-4 text-center">Schools</h1>
// //       {data?.length === 0 ? (
// //         <p className="text-center text-gray-500">No schools found.</p>
// //       ) : (
// //         <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
// //           {data.schools.map((student) => (
// //             <div
// //               key={student.id}
// //               className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
// //             >
// //               <p className="text-lg font-semibold">
// //                 {student.legalBusinessName}
// //               </p>
// //               <p className="text-gray-600">{student.region}</p>
// //               <p className="text-gray-600">{student }</p>
// //             </div>
// //           ))}
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
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

// export default function Students() {
//   const { data, error, isLoading } = useQuery<LegalBusiness[]>({
//     queryKey: ["students"],
//     queryFn: fetchStudents,
//   });

//   if (isLoading) return <p className="text-center text-gray-500">Loading...</p>;
//   if (error)
//     return <p className="text-center text-red-500">Error loading schools</p>;

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4 text-center">Schools</h1>
//       {data?.length === 0 ? (
//         <p className="text-center text-gray-500">No schools found.</p>
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
//               {school.students.length > 0 && (
//                 <p className="text-gray-600">
//                   Station: {school.students[0].Users?.Station?.station}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
