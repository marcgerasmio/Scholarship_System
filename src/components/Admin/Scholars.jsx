import Sidebar from "./Sidebar";
import { FaUserFriends } from "react-icons/fa";
import { useState, useEffect } from "react";
import supabase from "../supabaseClient";

const Scholars = () => {
  const [scholars, setScholars] = useState([]);
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [amount, setAmount] = useState('');
  const [scholarshipType, setScholarshipType] = useState(''); // State for scholarship type

  useEffect(() => {
    fetch_scholars();
  }, []);

  const fetch_scholars = async () => {
    try {
      const { data, error } = await supabase
        .from('scholars')
        .select('*')
        .neq('status', 'Completed');
      if (error) throw error;
      setScholars(data);
    } catch (error) {
      alert("An unexpected error occurred.");
      console.error('Error during registration:', error.message);
    }
  };

  const funding = async () => {
    try {
      const { data } = await supabase
        .from('funding')
        .insert([{
          full_name: selectedScholar.full_name,
          date_funded: formattedDate,
          amount,
          scholarship_type: selectedScholar.scholarship_type,
        }]);
      alert("Funded Successfully");
      window.location.reload();
    } catch (error) {
      alert("Error Adding Fund");
    }
  };

  const status_update = async () => {
    try {
      const { data } = await supabase
        .from('scholars')
        .update([{ status: "Completed" }])
        .eq('id', selectedScholar.id);
      funding();
    } catch (error) {
      alert("Error Status Update.");
    }
  };

  const openModal = (applicant) => {
    const modal = document.getElementById("my_modal_4");
    if (modal) {
      modal.showModal();
      setSelectedScholar(applicant);
    }
  };

  const closeModal = () => {
    const modal = document.getElementById("my_modal_4");
    if (modal) {
      modal.close();
    }
  };

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  const formattedDate = `${yyyy}-${mm}-${dd}`;

  // Filter scholars based on selected scholarship type
  const filteredScholars = scholarshipType 
    ? scholars.filter(scholar => scholar.scholarship_type === scholarshipType)
    : scholars;

  return (
    <>
      <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100 font-mono">
        <Sidebar />
        <main className="flex-1 p-4 lg:p-8 ml-0 lg:ml-64 transition-all duration-300">
          <div className="lg:flex lg:justify-between mb-5">
            <h1 className="text-2xl mt-2 font-bold flex gap-2">
              <FaUserFriends size={30} />
              List of Active Scholars
            </h1>
            <div className="flex gap-2">
              <select 
                className="select select-bordered w-full max-w-xs"
                onChange={(e) => setScholarshipType(e.target.value)} // Update the selected scholarship type
              >
                <option value="">
                  Scholarship Type:
                </option>
                <option value="New">New</option>
                <option value="Renewal">Renewal</option>
              </select>
            </div>
          </div>

          <div className="card rounded shadow-xl bordered p-5 bg-white">
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name of Scholar</th>
                    <th>Location</th>
                    <th>Contact No.</th>
                    <th>Name of School</th>
                    <th>Course</th>
                    <th>Sex</th>
                    <th>Status</th>
                    <th>Scholarship Type</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredScholars && filteredScholars.length > 0 ? (
                    filteredScholars.map((applicant) => (
                      <tr key={applicant.id}>
                        <td>{applicant.full_name}</td>
                        <td>{applicant.address}</td>
                        <td>{applicant.contact_no}</td>
                        <td>{applicant.school}</td>
                        <td>{applicant.course}</td>
                        <td>{applicant.sex}</td>
                        <td>{applicant.status}</td>
                        <td>{applicant.scholarship_type}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary text-white"
                            onClick={() => openModal(applicant)}
                          >
                            Add
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No data available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <dialog id="my_modal_4" className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Send Scholar's Funding</h3>
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-5"
            onClick={closeModal}
          >
            ✕
          </button>
          <div className="flex flex-col gap-3">
            <label className="input input-bordered flex items-center gap-2">
              Amount:
              <input
                type="text"
                className="grow w-full"
                placeholder="e.g, 21,000 (don't include peso sign)"
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
            <button className="btn btn-primary text-white" onClick={status_update}>Send</button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default Scholars;
