// "use client";
// import { useEffect } from "react";
// import "./willdeed.css";
// import "./willdeed.js";

// export default function WillDeed() {
//   useEffect(() => {
//     window.initWillDeed();
//   }, []);

//   return (
//     <div className="container">
//       <div className="header">
//         <div>
//           <div className="title">अंतिम वसीयतनामा (Will Deed) — Generator</div>
//           <div className="small">Preview में legal Hindi draft बनेगा — allocation mapping, rules, conditions और watermark included.</div>
//         </div>
//         <div className="controls">
//           <button className="btn save" onClick={() => window.saveDraft()}>💾 Save Draft</button>
//           <button className="btn preview" onClick={() => window.generatePreview()}>🔍 Preview</button>
//           <button className="btn submit" onClick={() => window.submitForm()}>✅ Submit</button>
//         </div>
//       </div>

//       <div id="formCard" className="card">
//         <div className="section" id="testatorSection">
//           <h2>1) वसीयतकर्ता (Testator)</h2>
//           <div className="person-grid">
//             <div className="row-1">
//               <div>
//                 <label>नाम</label>
//                 <div className="name-group">
//                   <select id="testatorPrefix"><option>श्री</option><option>श्रीमती</option><option>कुमारी</option><option>अन्य</option></select>
//                   <input type="text" id="testatorName" placeholder="पूरा नाम" />
//                 </div>
//               </div>
//               <div>
//                 <label>श्री पिता/पति का नाम</label>
//                 <input type="text" id="testatorFH" placeholder="पिता/पति का नाम" />
//               </div>
//               <div>
//                 <label>मोबाइल नंबर</label>
//                 <input type="tel" id="testatorMobile" placeholder="10 अंक" />
//               </div>
//               <div>
//                 <label>पता</label>
//                 <textarea id="testatorAddress"></textarea>
//               </div>
//             </div>
//             <div className="row-2">
//               <div>
//                 <label>Identity Type</label>
//                 <select id="testatorIdType"><option>आधार कार्ड</option><option>पैन कार्ड</option><option>वोटर आईडी</option><option>पासपोर्ट</option><option>ड्राइविंग लाइसेंस</option><option>अन्य</option></select>
//               </div>
//               <div>
//                 <label>Identity No.</label>
//                 <input type="text" id="testatorIdNo" />
//               </div>
//               <div>
//                 <label>Identity Upload</label>
//                 <input type="file" id="testatorIdUpload" accept=".pdf,.jpg,.jpeg,.png" />
//               </div>
//               <div>
//                 <label>Passport Photo</label>
//                 <div className="file-row">
//                   <input type="file" id="testatorPhoto" accept="image/*" onChange={(e)=>window.previewImage(e.target,'testatorPreview')} />
//                   <img id="testatorPreview" className="avatar" alt="" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="section">
//           <h2>2) लाभार्थी (Beneficiaries)</h2>
//           <div id="beneficiaries"></div>
//           <button className="btn add-btn" onClick={() => window.addBeneficiary()}>+ लाभार्थी जोड़ें</button>
//         </div>

//         <div className="section">
//           <h2>3) निष्पादक (Executors)</h2>
//           <div id="executors"></div>
//           <button className="btn add-btn" onClick={() => window.addExecutor()}>+ निष्पादक जोड़ें</button>
//         </div>

//         <div className="section">
//           <h2>4) गवाह (Witnesses)</h2>
//           <div id="witnesses"></div>
//           <button className="btn add-btn" onClick={() => window.addWitness()}>+ गवाह जोड़ें</button>
//         </div>

//         <div className="section">
//           <h2>5) संपत्ति विवरण (Property Details)</h2>
//           <label>संपत्ति का प्रकार चुनें</label>
//           <div className="input-inline">
//             <select id="propertyType" onChange={()=>onPropertyTypeChange()}>
//               <option value="">-- चुनें --</option>
//               <option value="immovable">अचल संपत्ति</option>
//               <option value="movable">चल संपत्ति</option>
//               <option value="both">दोनों</option>
//             </select>
//           </div>

//           <div id="immovableArea" style={{display:'none',marginTop:10}}>
//             <h3>अचल संपत्ति (Immovable)</h3>
//             <div id="immovableList"></div>
//             <button className="btn add-btn" onClick={() => window.addImmovable()}>+ अचल संपत्ति जोड़ें</button>
//           </div>

//           <div id="movableArea" style={{display:'none',marginTop:10}}>
//             <h3>चल संपत्ति (Movable)</h3>
//             <div id="movableList"></div>
//             <button className="btn add-btn" onClick={() => window.addMovable()}>+ चल संपत्ति जोड़ें</button>
//           </div>
//         </div>

//         <div className="section rules">
//           <h2>6) नियम एवं घोषणाएँ (Rules & Regulations)</h2>
//           <label><input type="checkbox" id="selectAllRules" onChange={(e)=>window.toggleAllRules(e.target)} /> Select All</label>
//           <div id="rulesList" style={{marginTop:8}}></div>
//           <div style={{marginTop:8}}>
//             <button className="btn" onClick={() => window.addCustomRule()}>+ Add More Rule</button>
//           </div>
//           <hr style={{margin:"12px 0"}} />
//           <label><input type="checkbox" id="enableConditions" onChange={(e)=>window.toggleConditions(e.target)} /> Add Conditions</label>
//           <div id="conditionsArea" style={{display:'none',marginTop:8}}>
//             <div id="conditionsList"></div>
//             <button className="btn" onClick={() => window.addCondition()}>+ Add Condition</button>
//           </div>
//         </div>

//         <div className="section">
//           <h3>7) Draft By</h3>
//           <label>Prepared By:
//             <select id="draftBy">
//               <option>Jyoh Services Pvt. Ltd.</option>
//               <option>Self</option>
//               <option>Other Advocate</option>
//             </select>
//           </label>
//           <div className="small">यह ड्राफ्टर नाम ड्राफ्ट में दिखाई देगा।</div>
//         </div>

//         <div className="small notice">नोट: फोटो/ID अपलोड केवल preview/metadata हेतु — सर्वर पर भेजने के लिए backend आवश्यक है।</div>
//       </div>

//       <div id="previewWrap" className="preview-wrap">
//         <div style={{display:'flex',gap:8,justifyContent:'flex-end',marginBottom:8}}>
//           <button className="btn" onClick={()=>{document.getElementById('previewWrap').style.display='none'; document.getElementById('formCard').style.display='block';}}>✏️ Edit</button>
//           <button className="btn save" onClick={() => window.saveDraft()}>💾 Save</button>
//           <button className="btn" onClick={()=>window.print()}>🖨️ Print</button>
//         </div>
//         <div className="preview-page">
//           <div className="watermark-layer" id="wmLayer"></div>
//           <div className="preview-body" id="previewBody"></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function onPropertyTypeChange(){
//   const val = document.getElementById('propertyType').value;
//   document.getElementById('immovableArea').style.display = (val==='immovable' || val==='both') ? 'block' : 'none';
//   document.getElementById('movableArea').style.display = (val==='movable' || val==='both') ? 'block' : 'none';
// }


"use client";
import { useEffect, useState } from "react";
import "./willdeed.css";
import "./willdeed.js";

export default function WillDeed() {
  const [willDeeds, setWillDeeds] = useState([]);
  const [stats, setStats] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedWillDeed, setSelectedWillDeed] = useState(null);

  useEffect(() => {
    window.initWillDeed();
    fetchWillDeeds();
    fetchStats();
  }, []);

  const fetchWillDeeds = async (page = 1, status = "") => {
    try {
      const query = new URLSearchParams({ page, limit: "10", status }).toString();
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/will-deed?${query}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch will deeds");
      const { data, totalPages, currentPage } = await res.json();
      setWillDeeds(data.willDeeds);
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (error) {
      console.error("Fetch will deeds error:", error);
      alert(`Error fetching will deeds: ${error.message}`);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/will-deed/stats`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const { data } = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Fetch stats error:", error);
      alert(`Error fetching stats: ${error.message}`);
    }
  };

  const viewWillDeed = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/will-deed/${id}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch will deed");
      const { data } = await res.json();
      setSelectedWillDeed(data.willDeed);
    } catch (error) {
      console.error("View will deed error:", error);
      alert(`Error viewing will deed: ${error.message}`);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/will-deed/${id}/status`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const { message } = await res.json();
      alert(message);
      fetchWillDeeds(currentPage);
    } catch (error) {
      console.error("Update status error:", error);
      alert(`Error updating status: ${error.message}`);
    }
  };

  const deleteWillDeed = async (id) => {
    if (!confirm("Are you sure you want to delete this will deed?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/will-deed/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete will deed");
      const { message } = await res.json();
      alert(message);
      fetchWillDeeds(currentPage);
    } catch (error) {
      console.error("Delete will deed error:", error);
      alert(`Error deleting will deed: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="header flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600">अंतिम वसीयतनामा (Will Deed) — Generator</h1>
          <p className="text-sm text-gray-600">
            Preview में legal Hindi draft बनेगा — allocation mapping, rules, conditions और watermark included.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => window.saveDraft()}>
            💾 Save Draft
          </button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => window.generatePreview()}>
            🔍 Preview
          </button>
          <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={() => window.submitForm()}>
            ✅ Submit
          </button>
        </div>
      </div>

      {/* Statistics Display */}
      {stats && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Will Deed Statistics</h2>
          <p>Total: {stats.total}</p>
          <p>Draft: {stats.draft}</p>
          <p>Submitted: {stats.submitted}</p>
          <p>Approved: {stats.approved}</p>
          <p>Rejected: {stats.rejected}</p>
        </div>
      )}

      {/* Will Deeds List */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Will Deeds</h2>
        <div className="grid gap-4">
          {willDeeds.map((deed) => (
            <div key={deed._id} className="p-4 bg-white shadow rounded">
              <p><strong>Testator:</strong> {deed.testator.fullName}</p>
              <p><strong>Status:</strong> {deed.meta.status}</p>
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                  onClick={() => viewWillDeed(deed._id)}
                >
                  View
                </button>
                <select
                  className="border rounded px-2 py-1"
                  onChange={(e) => updateStatus(deed._id, e.target.value)}
                  defaultValue={deed.meta.status}
                >
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteWillDeed(deed._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={currentPage === 1}
            onClick={() => fetchWillDeeds(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={currentPage === totalPages}
            onClick={() => fetchWillDeeds(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* Selected Will Deed Details */}
      {selectedWillDeed && (
        <div className="mb-6 p-4 bg-gray-100 rounded">
          <h2 className="text-lg font-semibold">Will Deed Details</h2>
          <p><strong>Testator:</strong> {selectedWillDeed.testator.fullName}</p>
          <p><strong>Status:</strong> {selectedWillDeed.meta.status}</p>
          <p><strong>Beneficiaries:</strong> {selectedWillDeed.beneficiaries.map(b => b.name).join(", ")}</p>
          <p><strong>Executors:</strong> {selectedWillDeed.executors.map(e => e.name).join(", ")}</p>
          <p><strong>Witnesses:</strong> {selectedWillDeed.witnesses.map(w => w.name).join(", ")}</p>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={() => setSelectedWillDeed(null)}
          >
            Close
          </button>
        </div>
      )}

      <div id="formCard" className="card bg-white p-6 rounded shadow">
        <div className="section">
          <h2 className="text-lg font-semibold">1) वसीयतकर्ता (Testator)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">नाम</label>
              <div className="flex gap-2">
                <select id="testatorPrefix" className="border rounded px-2 py-1">
                  <option>श्री</option>
                  <option>श्रीमती</option>
                  <option>कुमारी</option>
                  <option>अन्य</option>
                </select>
                <input
                  type="text"
                  id="testatorName"
                  className="border rounded px-2 py-1 w-full"
                  placeholder="पूरा नाम"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">श्री पिता/पति का नाम</label>
              <input
                type="text"
                id="testatorFH"
                className="border rounded px-2 py-1 w-full"
                placeholder="पिता/पति का नाम"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">मोबाइल नंबर</label>
              <input
                type="tel"
                id="testatorMobile"
                className="border rounded px-2 py-1 w-full"
                placeholder="10 अंक"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">पता</label>
              <textarea id="testatorAddress" className="border rounded px-2 py-1 w-full"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium">Identity Type</label>
              <select id="testatorIdType" className="border rounded px-2 py-1 w-full">
                <option>आधार कार्ड</option>
                <option>पैन कार्ड</option>
                <option>वोटर आईडी</option>
                <option>पासपोर्ट</option>
                <option>ड्राइविंग लाइसेंस</option>
                <option>अन्य</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">Identity No.</label>
              <input type="text" id="testatorIdNo" className="border rounded px-2 py-1 w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium">Identity Upload</label>
              <input
                type="file"
                id="testatorIdUpload"
                className="border rounded px-2 py-1 w-full"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Passport Photo</label>
              <div className="flex gap-2">
                <input
                  type="file"
                  id="testatorPhoto"
                  className="border rounded px-2 py-1"
                  accept="image/*"
                  onChange={(e) => window.previewImage(e.target, "testatorPreview")}
                />
                <img id="testatorPreview" className="w-16 h-16 object-cover rounded" alt="" />
              </div>
            </div>
          </div>
        </div>

        <div className="section mt-6">
          <h2 className="text-lg font-semibold">2) लाभार्थी (Beneficiaries)</h2>
          <div id="beneficiaries"></div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={() => window.addBeneficiary()}
          >
            + लाभार्थी जोड़ें
          </button>
        </div>

        <div className="section mt-6">
          <h2 className="text-lg font-semibold">3) निष्पादक (Executors)</h2>
          <div id="executors"></div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={() => window.addExecutor()}
          >
            + निष्पादक जोड़ें
          </button>
        </div>

        <div className="section mt-6">
          <h2 className="text-lg font-semibold">4) गवाह (Witnesses)</h2>
          <div id="witnesses"></div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={() => window.addWitness()}
          >
            + गवाह जोड़ें
          </button>
        </div>

        <div className="section mt-6">
          <h2 className="text-lg font-semibold">5) संपत्ति विवरण (Property Details)</h2>
          <label className="block text-sm font-medium">संपत्ति का प्रकार चुनें</label>
          <select
            id="propertyType"
            className="border rounded px-2 py-1"
            onChange={() => window.onPropertyTypeChange()}
          >
            <option value="">-- चुनें --</option>
            <option value="immovable">अचल संपत्ति</option>
            <option value="movable">चल संपत्ति</option>
            <option value="both">दोनों</option>
          </select>

          <div id="immovableArea" className="mt-4 hidden">
            <h3 className="text-md font-semibold">अचल संपत्ति (Immovable)</h3>
            <div id="immovableList"></div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => window.addImmovable()}
            >
              + अचल संपत्ति जोड़ें
            </button>
          </div>

          <div id="movableArea" className="mt-4 hidden">
            <h3 className="text-md font-semibold">चल संपत्ति (Movable)</h3>
            <div id="movableList"></div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => window.addMovable()}
            >
              + चल संपत्ति जोड़ें
            </button>
          </div>
        </div>

        <div className="section mt-6">
          <h2 className="text-lg font-semibold">6) नियम एवं घोषणाएँ (Rules & Regulations)</h2>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              id="selectAllRules"
              onChange={(e) => window.toggleAllRules(e.target)}
            />
            Select All
          </label>
          <div id="rulesList" className="mt-2"></div>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={() => window.addCustomRule()}
          >
            + Add More Rule
          </button>
          <hr className="my-4" />
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enableConditions"
              onChange={(e) => window.toggleConditions(e.target)}
            />
            Add Conditions
          </label>
          <div id="conditionsArea" className="mt-2 hidden">
            <div id="conditionsList"></div>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
              onClick={() => window.addCondition()}
            >
              + Add Condition
            </button>
          </div>
        </div>

        <div className="section mt-6">
          <h3 className="text-md font-semibold">7) Draft By</h3>
          <label className="block text-sm font-medium">
            Prepared By:
            <select id="draftBy" className="border rounded px-2 py-1 mt-1">
              <option>Jyoh Services Pvt. Ltd.</option>
              <option>Self</option>
              <option>Other Advocate</option>
            </select>
          </label>
          <p className="text-sm text-gray-600 mt-1">
            यह ड्राफ्टर नाम ड्राफ्ट में दिखाई देगा।
          </p>
        </div>

        <p className="text-sm text-gray-600 mt-4">
          नोट: फोटो/ID अपलोड केवल preview/metadata हेतु — सर्वर पर भेजने के लिए backend आवश्यक है।
        </p>
      </div>

      <div id="previewWrap" className="preview-wrap hidden">
        <div className="flex justify-end gap-2 mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={() => {
              document.getElementById("previewWrap").className = "preview-wrap hidden";
              document.getElementById("formCard").className = "card bg-white p-6 rounded shadow";
            }}
          >
            ✏️ Edit
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => window.saveDraft()}>
            💾 Save
          </button>
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => window.print()}>
            🖨️ Print
          </button>
        </div>
        <div className="preview-page bg-white p-6 rounded shadow relative">
          <div className="watermark-layer" id="wmLayer"></div>
          <div className="preview-body" id="previewBody"></div>
        </div>
      </div>
    </div>
  );
}