"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader, Loader2 } from "lucide-react";
import { useState, useMemo, useCallback } from "react";
import { Cell, Legend } from "recharts";
import { ResponsiveContainer, PieChart, Pie, Tooltip } from "recharts";

async function fetchRegions() {
  const { data } = await axios.get(
    "https://new-driver-back.onrender.com/api/analytics/region"
  );
  return data.data;
}

async function fetchStudents() {
  const { data } = await axios.get(
    "https://new-driver-back.onrender.com/api/analytics/schools"
  );
  return data.data;
}

export default function Regions() {
  const [selectedStation, setSelectedStation] = useState("");

  const {
    data: regionsData,
    error: regionsError,
    isLoading: regionsLoading,
  } = useQuery({
    queryKey: ["regions"],
    queryFn: fetchRegions,
  });

  const {
    data: studentsData,
    error: studentsError,
    isLoading: studentsLoading,
  } = useQuery({
    queryKey: ["students"],
    queryFn: fetchStudents,
  });

  const studentsByStation = useMemo(() => {
    const map = new Map();
    if (studentsData) {
      studentsData.schools.forEach((school: any) => {
        school.students.forEach((student: any) => {
          const station = student.Users?.Station?.station;
          if (station) {
            map.set(station, (map.get(station) || 0) + 1);
          }
        });
      });
    }
    return map;
  }, [studentsData]);

  const filteredStudents = useMemo(() => {
    if (selectedStation && studentsData) {
      return studentsData.schools.flatMap((school: any) =>
        school.students.filter(
          (student: any) => student.Users?.Station?.station === selectedStation
        )
      );
    }
    return [];
  }, [selectedStation, studentsData]);

  const handleStationOpen = useCallback((station: any) => {
    setSelectedStation(station);
  }, []);

  const handleClose = () => {
    setSelectedStation("");
  };

  if (regionsLoading || studentsLoading)
    return (
      <div className="h-screen justify-center flex items-center">
        <Loader className="animate-spin" />
      </div>
    );
  if (regionsError || studentsError) return <p>Error loading data</p>;
  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
    "#FF5733",
  ];

  const schoolsDistribution = studentsData.schools
    .filter((school: any) =>
      school.students.some(
        (student: any) => student.Users?.Station?.station === selectedStation
      )
    )
    .map((school: any) => ({
      name: school.legalBusinessName,
      students: school.students.filter(
        (student: any) => student.Users?.Station?.station === selectedStation
      ).length,
    }));

  //another distribution for passed and failed students

  const passedStudents = studentsData.schools
    .flatMap((school: any) =>
      school.students.filter(
        (student: any) => student.Users?.Station?.station === selectedStation
      )
    )
    .filter(
      (student: any) =>
        student.DrivingExamResult.length > 0 &&
        student.ComputerExamResult.length > 0 &&
        Number(student.DrivingExamResult[0]?.result) +
          Number(student.ComputerExamResult[0]?.result) >
          50
    ).length;

  const failedStudents = studentsData.schools
    .flatMap((school: any) =>
      school.students.filter(
        (student: any) => student.Users?.Station?.station === selectedStation
      )
    )
    .filter(
      (student: any) =>
        student.DrivingExamResult.length > 0 &&
        student.ComputerExamResult.length > 0 &&
        Number(student.DrivingExamResult[0]?.result) +
          Number(student.ComputerExamResult[0]?.result) <=
          50
    ).length;

  //number of stations in each region for the first chart
  const stationsByRegion = regionsData.map((regionItem: any) => ({
    name: regionItem.region,
    students: regionItem.stations.length,
  }));

  //total number of students in each station for the second chart

  const studentsByStationData = Array.from(studentsByStation).map(
    ([station, students]) => ({
      name: station,
      students,
    })
  );

  console.log("schoolsDistribution", schoolsDistribution);
  return (
    <div className="p-4 bg-white text-sm">
      {!selectedStation && (
        <>
          <div>
            <h1 className="text-2xl font-bold mb-4">Regions and Stations</h1>
            <ul className="space-y-4">
              {regionsData?.map((regionItem: any) => (
                <li
                  key={regionItem.region}
                  className="p-4 border rounded-lg shadow"
                >
                  <h2 className="text-lg font-semibold">{regionItem.region}</h2>
                  <p>{regionItem.stations.length} stations</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {regionItem.stations.map((station: any) => (
                      <div
                        key={station}
                        className="shadow-md p-4 border rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => handleStationOpen(station)}
                      >
                        <h3 className="text-lg font-semibold">{station}</h3>
                        <p className="text-gray-600">
                          TotalStudents:{studentsByStation.get(station) || 0}{" "}
                        </p>
                        <p className="text-gray-600 flex ">
                          {
                            // Updated to count passed students correctly
                            studentsData.schools
                              .flatMap((school: any) =>
                                school.students.filter(
                                  (student: any) =>
                                    student.Users?.Station?.station === station
                                )
                              )
                              .filter(
                                (student: any) =>
                                  student.DrivingExamResult.length > 0 &&
                                  student.ComputerExamResult.length > 0 &&
                                  Number(student.DrivingExamResult[0]?.result) +
                                    Number(
                                      student.ComputerExamResult[0]?.result
                                    ) >
                                    50
                              ).length
                          }{" "}
                          passed {/* //show failed students */}
                        </p>
                        <p>
                          {
                            // Updated to count failed students correctly
                            studentsData.schools
                              .flatMap((school: any) =>
                                school.students.filter(
                                  (student: any) =>
                                    student.Users?.Station?.station === station
                                )
                              )
                              .filter(
                                (student: any) =>
                                  student.DrivingExamResult.length > 0 &&
                                  student.ComputerExamResult.length > 0 &&
                                  Number(student.DrivingExamResult[0]?.result) +
                                    Number(
                                      student.ComputerExamResult[0]?.result
                                    ) <=
                                    50
                              ).length
                          }{" "}
                          failed
                        </p>
                      </div>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="h-screen mt-10 flex gap-8">
            <div
              style={{ width: "100%", maxWidth: "500px", height: "300px" }}
              className="border"
            >
              <h2 className="text-sm text-center py-2 font-semibold text-gray-800 mb-4">
                Regions Distribution by Stations
              </h2>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={stationsByRegion}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="students"
                    nameKey="name"
                    label={true}
                    labelLine={true}
                  >
                    {stationsByRegion.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div
              style={{ width: "100%", maxWidth: "500px", height: "300px" }}
              className="border"
            >
              <h2 className="text-sm text-center py-2 font-semibold text-gray-800 mb-4">
                Student distribution by Stations
              </h2>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={studentsByStationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={3}
                    dataKey="students"
                    nameKey="name"
                    label={true}
                    labelLine={true}
                  >
                    {studentsByStationData.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {selectedStation && (
        <div className="p-4 mt-4 border rounded-lg shadow">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold  ">
              <p className="text-center">Station: {selectedStation}</p>
            </h2>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
          <p>
            Number of Schools:{" "}
            {
              studentsData.schools.filter(
                (school: any) =>
                  school.students.filter(
                    (student: any) =>
                      student.Users?.Station?.station === selectedStation
                  ).length > 0
              ).length
            }
          </p>
          {/* <p> schools: {studentsData.schools.filter()}</p> */}
          <div className="flex gap-5 mb-5">
            {
              //show name of the available schools in the station and their number of students in each school

              studentsData.schools
                .filter(
                  (school: any) =>
                    school.students.filter(
                      (student: any) =>
                        student.Users?.Station?.station === selectedStation
                    ).length > 0
                )
                .map((school: any) => (
                  <div key={school.id} className="mt-2 border p-2 rounded-md">
                    <p className=" font-semibold">{school.legalBusinessName}</p>
                    <p>
                      {
                        school.students.filter(
                          (student: any) =>
                            student.Users?.Station?.station === selectedStation
                        ).length
                      }{" "}
                      students
                    </p>
                  </div>
                ))
            }
          </div>
          <div className="flex gap-2 justify-center">
            {
              //show chart ifthere is any student in the station
              studentsData.schools.flatMap((school: any) =>
                school.students.filter(
                  (student: any) =>
                    student.Users?.Station?.station === selectedStation
                )
              ).length > 0 && (
                <div
                  style={{ width: "100%", maxWidth: "500px", height: "300px" }}
                  className="border"
                >
                  <h2 className="text-sm text-center py-2 font-semibold text-gray-800 mb-4">
                    Students Distribution by School
                  </h2>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={schoolsDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={3}
                        dataKey="students"
                        nameKey="name"
                        label={true}
                        labelLine={true}
                      >
                        {schoolsDistribution.map((entry: any, index: any) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )
            }
            {
              //show chart if there is any student with result
              studentsData.schools
                .flatMap((school: any) =>
                  school.students.filter(
                    (student: any) =>
                      student.Users?.Station?.station === selectedStation
                  )
                )
                .some(
                  (student: any) =>
                    student.DrivingExamResult.length > 0 &&
                    student.ComputerExamResult.length > 0
                ) && (
                <div
                  style={{ width: "100%", maxWidth: "500px", height: "300px" }}
                  className="border"
                >
                  <h2 className="text-sm text-center py-2 font-semibold text-gray-800 mb-4">
                    Students Distribution by Result
                  </h2>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Passed", value: passedStudents },
                          { name: "Failed", value: failedStudents },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={3}
                        dataKey="value"
                        nameKey="name"
                        label={true}
                        labelLine={true}
                      >
                        {[
                          { name: "Passed", value: passedStudents },
                          { name: "Failed", value: failedStudents },
                        ].map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )
            }
          </div>

          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto mt-10 ">
              <p>
                Total: {studentsByStation.get(selectedStation) || 0} students
              </p>

              <table className="min-w-full table-fixed border-collapse mt-4">
                <thead>
                  <tr>
                    <th className="border px-4 py-2 text-left">Number</th>
                    <th className="border px-4 py-2 text-left">First Name</th>
                    <th className="border px-4 py-2 text-left">
                      Father's Name
                    </th>
                    <th className="border px-4 py-2 text-left">Station</th>
                    <th className="border px-4 py-2 text-left">School</th>
                    <th className="border px-4 py-2 text-left">LicenseType</th>
                    <th className="border px-4 py-2 text-left">Result</th>
                    <th className="border px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student: any) => (
                    <tr key={student.id}>
                      <td className="border px-4 py-2">
                        {
                          //show index of the student
                          studentsData.schools
                            .flatMap((school: any) =>
                              school.students.filter(
                                (student: any) =>
                                  student.Users?.Station?.station ===
                                  selectedStation
                              )
                            )
                            .indexOf(student) + 1
                        }
                      </td>
                      <td className="border px-4 py-2">{student.firstName}</td>
                      <td className="border px-4 py-2">
                        {student.fathersName}
                      </td>
                      <td className="border px-4 py-2">
                        {student.Users?.Station?.station || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {student.Users?.School?.map((school: any) => (
                          <span key={school.id}>
                            {school.legalBusinessName}
                          </span>
                        )) || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {student.licenseType || "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {(student.DrivingExamResult.length > 0 &&
                          student.ComputerExamResult.length > 0 &&
                          student.DrivingExamResult[0]?.result +
                            +student.ComputerExamResult[0]?.result) ||
                          "N/A"}
                      </td>
                      <td className="border px-4 py-2">
                        {student.DrivingExamResult.length > 0 &&
                        student.ComputerExamResult.length > 0
                          ? Number(student.DrivingExamResult[0]?.result) +
                              Number(student.ComputerExamResult[0]?.result) >
                            50
                            ? "Pass"
                            : "Fail"
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No students available for this station.</p>
          )}
        </div>
      )}
    </div>
  );
}
