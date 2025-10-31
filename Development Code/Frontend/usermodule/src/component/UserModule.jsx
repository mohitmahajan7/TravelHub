import React, { useState, useMemo, useRef } from "react";
import {
  FaBars,
  FaBell,
  FaBed,
  FaBus,
  FaCar,
  FaCheckCircle,
  FaClock,
  FaEllipsisH,
  FaEye,
  FaInfoCircle,
  FaList,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaPlane,
  FaPlus,
  FaPlusCircle,
  FaSearch,
  FaSignOutAlt,
  FaSuitcase,
  FaTasks,
  FaTimes,
  FaTrain,
  FaUser,
  FaUserTie,
  FaTimesCircle,
  FaSave,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaDownload,
  FaCamera,
  FaLock
} from "react-icons/fa";
import styles from './UserModule.module.css';

// Small UI helpers
const Badge = ({ variant = "pending", children }) => {
  const classes = {
    pending:
      "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200 px-2 py-0.5 rounded-full text-xs font-medium",
    approved:
      "bg-green-100 text-green-800 ring-1 ring-green-200 px-2 py-0.5 rounded-full text-xs font-medium",
    rejected:
      "bg-red-100 text-red-800 ring-1 ring-red-200 px-2 py-0.5 rounded-full text-xs font-medium",
    booked:
      "bg-blue-100 text-blue-800 ring-1 ring-blue-200 px-2 py-0.5 rounded-full text-xs font-medium",
    completed:
      "bg-gray-200 text-gray-800 ring-1 ring-gray-300 px-2 py-0.5 rounded-full text-xs font-medium",
    draft:
      "bg-gray-100 text-gray-800 ring-1 ring-gray-300 px-2 py-0.5 rounded-full text-xs font-medium",
  }[variant];
  return <span className={classes}>{children}</span>;
};

const CardKPI = ({ icon, title, value, tone = "blue", onClick }) => (
  <div className={styles.statCard} onClick={onClick}>
    <div className={`${styles.statIcon} ${styles[tone]}`}>
      {icon}
    </div>
    <div className={styles.statInfo}>
      <h3>{value}</h3>
      <p>{title}</p>
    </div>
  </div>
);

const Milestone = ({ title, subtitle, desc, state = "idle" }) => {
  const bubble =
    state === "completed"
      ? styles.completed
      : state === "active"
      ? styles.active
      : styles.idle;
  return (
    <div className={styles.milestone}>
      <div className={`${styles.milestoneBubble} ${bubble}`}></div>
      <h4>{title}</h4>
      <p className={styles.milestoneSubtitle}>{subtitle}</p>
      <p className={styles.milestoneDesc}>{desc}</p>
      <div className={styles.milestoneLine} />
    </div>
  );
};

const DocumentCard = ({ icon, title, description, date, size }) => (
  <div className={styles.documentCard}>
    <div className={styles.documentIcon}>
      {icon}
    </div>
    <div className={styles.documentInfo}>
      <h4>{title}</h4>
      <p>{description}</p>
      <div className={styles.documentMeta}>
        <span>{date}</span>
        <span>{size}</span>
      </div>
    </div>
    <button className={styles.downloadBtn}>
      <FaDownload className={styles.btnIconSvg} /> Download
    </button>
  </div>
);

const UserModule = () => {
  const [activeContent, setActiveContent] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const formRef = useRef();

  // Sample requests (could be fetched)
  const [requests, setRequests] = useState([
    {
      id: "TR-2023-001",
      title: "New York Business Conference",
      destination: "New York, USA",
      from: "San Francisco, USA",
      dates: "15 Aug - 20 Aug 2023",
      stage: "Finance Approval",
      status: "pending",
    },
    {
      id: "TR-2023-002",
      title: "Client Meetings",
      destination: "London, UK",
      from: "San Francisco, USA",
      dates: "22 Aug - 28 Aug 2023",
      stage: "Completed",
      status: "approved",
    },
    {
      id: "TR-2023-003",
      title: "Partner Visit",
      destination: "Tokyo, Japan",
      from: "San Francisco, USA",
      dates: "5 Sep - 12 Sep 2023",
      stage: "Completed",
      status: "booked",
    },
    {
      id: "TR-2023-004",
      title: "Team Offsite",
      destination: "Los Angeles, USA",
      from: "San Francisco, USA",
      dates: "20 Sep - 23 Sep 2023",
      stage: "Manager Approval",
      status: "rejected",
    },
    {
      id: "TR-2023-005",
      title: "Quarterly Review Planning",
      destination: "Chicago, USA",
      from: "San Francisco, USA",
      dates: "10 Oct - 12 Oct 2023",
      stage: "Draft",
      status: "draft",
    },
  ]);

  const [selectedId, setSelectedId] = useState(requests[0].id);
  const selected = useMemo(
    () => requests.find((r) => r.id === selectedId) ?? requests[0],
    [selectedId, requests]
  );

  const headerTitle = {
    dashboard: "Dashboard",
    "my-requests": "My Requests",
    "new-request": "New Request",
    "request-detail": "Request Details",
  }[activeContent];

  const filtered = useMemo(() => {
    if (filter === "All") return requests;
    return requests.filter((r) => r.status.toLowerCase() === filter.toLowerCase());
  }, [filter, requests]);

  // Handlers
  const goto = (screen, statusFilter = "All") => {
    setActiveContent(screen);
    if (screen === "request-detail" && !selectedId) {
      setSelectedId(requests[0].id);
    }
    if (screen === "my-requests") setFilter(statusFilter);
    setSidebarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const modes = formData.getAll("modeOfTravel");
    if (modes.length === 0) {
      alert("Please select at least one mode of travel.");
      return;
    }
    
    // Create a new request object
    const newRequest = {
      id: `TR-2023-${String(requests.length + 1).padStart(3, '0')}`,
      title: formData.get("destination") + " Trip",
      destination: formData.get("destination"),
      from: formData.get("from"),
      dates: `${formData.get("start")} - ${formData.get("end")}`,
      stage: "Manager Approval",
      status: "pending",
    };
    
    // Add the new request to the list
    setRequests(prevRequests => [...prevRequests, newRequest]);
    
    // Set the new request as selected
    setSelectedId(newRequest.id);
    
    alert("Travel request submitted successfully! You can now track its progress.");
    goto("request-detail");
  };

  const handleSaveDraft = (e) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    
    const formData = new FormData(form);
    
    // Create a draft request object with proper fallbacks
    const draftRequest = {
      id: `TR-2023-${String(requests.length + 1).padStart(3, '0')}`,
      title: formData.get("destination") ? `${formData.get("destination")} Trip` : "Draft Request",
      destination: formData.get("destination") || "Not specified",
      from: formData.get("from") || "Not specified",
      dates: formData.get("start") && formData.get("end") 
        ? `${formData.get("start")} - ${formData.get("end")}` 
        : "Dates not set",
      stage: "Draft",
      status: "draft",
    };
    
    // Add the draft request to the list using functional update
    setRequests(prevRequests => [...prevRequests, draftRequest]);
    
    // Set the draft request as selected
    setSelectedId(draftRequest.id);
    
    alert("Travel request saved as draft successfully!");
    
    // Reset the form
    form.reset();
    
    // Navigate after state is updated
    setTimeout(() => {
      setFilter("draft");
      goto("my-requests", "draft");
    }, 100);
  };

  const avatar = "https://ui-avatars.com/api/?name=John+Doe&background=0D8ABC&color=fff";

  const renderContent = () => {
    switch (activeContent) {
      case 'dashboard':
        return (
          <div className={styles.content}>
            <br></br>
            <h2>User DashBoard</h2>
            <p>Welcome to your Travel Management System dashboard</p>

            <div className={styles.statsContainer}>
              <CardKPI 
                icon={<FaSuitcase className={styles.statIconSvg} />} 
                title="My Requests" 
                value={requests.length} 
                tone="total"
                onClick={() => goto("my-requests", "All")}
              />
              <CardKPI 
                icon={<FaCheckCircle className={styles.statIconSvg} />} 
                title="Approved" 
                value={requests.filter(r=>r.status==='approved').length} 
                tone="approved"
                onClick={() => goto("my-requests", "approved")}
              />
              <CardKPI 
                icon={<FaClock className={styles.statIconSvg} />} 
                title="Pending" 
                value={requests.filter(r=>r.status==='pending').length} 
                tone="pending"
                onClick={() => goto("my-requests", "pending")}
              />
              <CardKPI 
                icon={<FaTimesCircle className={styles.statIconSvg} />} 
                title="Rejected" 
                value={requests.filter(r=>r.status==='rejected').length} 
                tone="rejected"
                onClick={() => goto("my-requests", "rejected")}
              />
              <CardKPI 
                icon={<FaSave className={styles.statIconSvg} />} 
                title="Drafts" 
                value={requests.filter(r=>r.status==='draft').length} 
                tone="draft"
                onClick={() => goto("my-requests", "draft")}
              />
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Recent Requests with Status</h3>
                <button 
                  className={styles.btnPrimary} 
                  onClick={() => goto("new-request")}
                >
                  <FaPlus className={styles.btnIconSvg} /> New Request
                </button>
              </div>
              <div className={styles.cardBody}>
                <table>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Destination</th>
                      <th>Dates</th>
                      <th>Current Approval</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((r) => (
                      <tr
                        key={r.id}
                        className={styles.clickableRow}
                        onClick={() => {
                          setSelectedId(r.id);
                          goto("request-detail");
                        }}
                      >
                        <td>{r.id}</td>
                        <td>{r.destination}</td>
                        <td>{r.dates}</td>
                        <td>{r.stage}</td>
                        <td>
                          <span className={`${styles.status} ${styles[r.status]}`}>
                            {r.status[0].toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardHeader}>Quick Actions</h3>
              <div className={`${styles.cardBody} ${styles.quickActions}`}>
                <div className={styles.quickActionGrid}>
                  <button onClick={() => goto("new-request")} className={styles.quickActionBtn}>
                    <div className={`${styles.quickActionIcon} ${styles.blue}`}>
                      <FaPlus className={styles.quickActionSvg} />
                    </div>
                    <span>New Travel Request</span>
                  </button>
                  <button onClick={() => goto("my-requests")} className={styles.quickActionBtn}>
                    <div className={`${styles.quickActionIcon} ${styles.green}`}>
                      <FaList className={styles.quickActionSvg} />
                    </div>
                    <span>View My Requests</span>
                  </button>
                  <button onClick={() => goto("request-detail")} className={styles.quickActionBtn}>
                    <div className={`${styles.quickActionIcon} ${styles.purple}`}>
                      <FaTasks className={styles.quickActionSvg} />
                    </div>
                    <span>Track Approval</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
    case 'request-detail':
  return (
    <div className={styles.content}>
      <div className={styles.detailHeader}>
        <h2>Travel Request Details</h2>
        <button onClick={() => goto("my-requests")} className={styles.btnSecondary}>
          <span className={styles.btnIconSvg}>←</span> Back to Requests
        </button>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeaderFlex}>
          <div>
            <h3>{selected.title}</h3>
            <p>Request ID: {selected.id}</p>
          </div>
          <div>
            <span className={`${styles.status} ${styles[selected.status]}`}>
              {selected.status === "pending"
                ? "Pending Approval"
                : selected.status === "approved"
                ? "Approved"
                : selected.status === "booked"
                ? "Booked"
                : selected.status === "rejected"
                ? "Rejected"
                : selected.status === "draft"
                ? "Draft"
                : "Status"}
            </span>
          </div>
        </div>

        <div className={styles.cardBodyGrid}>
          <div>
            <h4>Trip Details</h4>
            <div className={styles.detailList}>
              <div className={styles.detailItem}><span>Destination:</span><span>{selected.destination}</span></div>
              <div className={styles.detailItem}><span>Departure From:</span><span>{selected.from}</span></div>
              <div className={styles.detailItem}><span>Dates:</span><span>{selected.dates}</span></div>
              <div className={styles.detailItem}><span>Purpose:</span><span>Annual Tech Leadership Conference</span></div>
            </div>
          </div>
          <div>
            <h4>Travel Preferences</h4>
            <div className={styles.detailList}>
              <div className={styles.detailItem}><span>Flight:</span><span>Business Class</span></div>
              <div className={styles.detailItem}><span>Hotel:</span><span>4-Star, city center</span></div>
              <div className={styles.detailItem}><span>Transport:</span><span>Rental car & taxi</span></div>
              <div className={styles.detailItem}><span>Mode of Travel:</span><span>Flight, Hotel, Local Transport</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Completed moved to top */}
      {(selected.status === "approved" || selected.status === "booked") && (
        <div className={styles.card+''+' '+styles.processCard}>
          <div className={styles.processComplete}>
            <FaCheckCircle className={styles.processCompleteIcon} />
            <h4>Process Completed</h4>
            <p>Your travel request has been fully processed and all arrangements have been made.</p>
          </div>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h3>Approval Process</h3>
          <p>Track the progress of your request through the approval workflow</p>
        </div>
        <div className={styles.cardBody}>
          {selected.status === "draft" ? (
            <div className={styles.draftNotice}>
              <FaInfoCircle className={styles.draftNoticeIcon} />
              <p>This is a draft request. Submit it to start the approval process.</p>
            </div>
          ) : selected.status === "approved" || selected.status === "booked" ? (
            <>
              <Milestone title="Request Submitted" subtitle="August 9, 2023 - 10:09 AM" desc="You submitted the travel request for approval" state="completed" />
              <Milestone title="Manager Approval" subtitle="August 6, 2023 - 9:15 AM" desc="Sarah Johnson (Manager) approved your request" state="completed" />
              <Milestone title="Finance Department" subtitle="August 7, 2023 - 11:45 AM" desc="Finance team approved the budget" state="completed" />
              <Milestone title="Travel Desk" subtitle="August 8, 2023 - 3:20 PM" desc="Travel desk completed all bookings" state="completed" />
              <Milestone title="HR Notification" subtitle="August 9, 2023 - 10:00 AM" desc="HR has been notified for records" state="completed" />
              <Milestone title="Completion" subtitle="August 9, 2023 - 10:00 AM" desc="Request has been completed successfully" state="completed" />
            </>
          ) : (
            <>
              <Milestone title="Request Submitted" subtitle="August 5, 2023 - 10:30 AM" desc="You submitted the travel request for approval" state="completed" />
              <Milestone title="Manager Approval" subtitle="August 6, 2023 - 9:15 AM" desc="Sarah Johnson (Manager) approved your request" state="completed" />
              <Milestone title="Finance Department" subtitle="Pending" desc="Awaiting budget approval from Finance team" state="active" />
              <Milestone title="Travel Desk" subtitle="Not started" desc="Travel desk will book flights and accommodation" />
              <Milestone title="HR Notification" subtitle="Not started" desc="HR will be notified for records" />
              <Milestone title="Completion" subtitle="Not started" desc="Request will be marked as completed" />
            </>
          )}
        </div>
      </div>

      {(selected.status === "approved" || selected.status === "booked") && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>Travel Documents</h3>
            <p>Download your travel documents and itineraries</p>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.documentsGrid}>
              <DocumentCard
                icon={<FaFilePdf className={styles.docIconPdf} />}
                title="Flight Booking Confirmation"
                description="Round trip flight to London, UK - Business Class"
                date="Aug 15, 2023"
                size="1.2 MB"
              />
              <DocumentCard
                icon={<FaFilePdf className={styles.docIconPdf} />}
                title="Hotel Reservation"
                description="The Ritz London - Executive Suite"
                date="Aug 15, 2023"
                size="0.8 MB"
              />
              <DocumentCard
                icon={<FaFileWord className={styles.docIconDoc} />}
                title="Car Rental Agreement"
                description="Hertz rental car - Premium Sedan"
                date="Aug 16, 2023"
                size="2.1 MB"
              />
              <DocumentCard
                icon={<FaFileExcel className={styles.docIconXls} />}
                title="Expense Report Form"
                description="Per diem and expense calculation"
                date="Aug 16, 2023"
                size="0.5 MB"
              />
              <DocumentCard
                icon={<FaFileImage className={styles.docIconImage} />}
                title="Conference Pass"
                description="Global Tech Summit 2023"
                date="Aug 17, 2023"
                size="1.5 MB"
              />
              <DocumentCard
                icon={<FaFilePdf className={styles.docIconPdf} />}
                title="Travel Insurance"
                description="Comprehensive travel insurance coverage"
                date="Aug 18, 2023"
                size="1.8 MB"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
      case 'new-request':
        return (
          <div className={styles.content}>
            <div className={styles.detailHeader}>
              <h2>New Travel Request</h2>
              <button onClick={() => goto("dashboard")} className={styles.btnSecondary}>
                <span className={styles.btnIconSvg}>←</span> Cancel
              </button>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoCardContent}>
                <FaInfoCircle className={styles.infoIcon} />
                <div>
                  <h3>Policy Information for L3 Grade</h3>
                  <div className={styles.infoList}>
                    <p><strong>Flight:</strong> Economy class for domestic, Business class for international</p>
                    <p><strong>Hotel:</strong> Up to ₹4,000/night for domestic, ₹8,000/night for international</p>
                    <p><strong>Per Diem:</strong> ₹1,500/day domestic, $75/day international</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Destination</label>
                    <input name="destination" type="text" className={styles.formControl} placeholder="Enter destination" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Departure From</label>
                    <input name="from" type="text" className={styles.formControl} placeholder="Enter departure location" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Start Date</label>
                    <input name="start" type="date" className={styles.formControl} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>End Date</label>
                    <input name="end" type="date" className={styles.formControl} />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Purpose of Travel</label>
                    <textarea name="purpose" className={styles.formControl} rows="3" placeholder="Describe the purpose of your travel" />
                  </div>
                  <div className={styles.formGroupFull}>
                    <label>Mode of Travel (Select all that apply)</label>
                    <div className={styles.checkboxGrid}>
                      {[
                        { id: "flight", icon: <FaPlane />, label: "Flight" },
                        { id: "train", icon: <FaTrain />, label: "Train" },
                        { id: "car", icon: <FaCar />, label: "Car/Taxi" },
                        { id: "bus", icon: <FaBus />, label: "Bus" },
                        { id: "hotel", icon: <FaBed />, label: "Hotel" },
                        { id: "meals", icon: <FaUtensils />, label: "Meals" },
                        { id: "localTransport", icon: <FaMapMarkerAlt />, label: "Local Transport" },
                        { id: "other", icon: <FaEllipsisH />, label: "Other" },
                      ].map((m) => (
                        <label key={m.id} className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            id={m.id}
                            name="modeOfTravel"
                            value={m.id}
                            className={styles.checkboxInput}
                          />
                          <span className={styles.checkboxText}>
                            {m.icon}
                            {m.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={styles.formActions}>
                  <button type="reset" className={styles.btnSecondary}>Reset</button>
                  <button type="button" onClick={handleSaveDraft} className={styles.btnDraft}>
                    <FaSave className={styles.btnIconSvg} /> Save as Draft
                  </button>
                  <button type="submit" className={styles.btnAccent}>Submit Request</button>
                </div>
              </form>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h3>Approval Process</h3>
                <p>After submission, your request will go through the following approval steps:</p>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.processStep}>
                  <div className={styles.processIcon}><FaUserTie /></div>
                  <div>
                    <h4>Manager Approval</h4>
                    <p>Your direct manager will review and approve your request</p>
                  </div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.processIcon}><FaMoneyBillWave /></div>
                  <div>
                    <h4>Finance Department</h4>
                    <p>Finance team will verify budget allocation</p>
                  </div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.processIcon}><FaPlane /></div>
                  <div>
                    <h4>Travel Desk</h4>
                    <p>Travel desk will arrange bookings as per policy</p>
                  </div>
                </div>
                <div className={styles.processStep}>
                  <div className={styles.processIcon}><FaCheckCircle /></div>
                  <div>
                    <h4>HR Notification</h4>
                    <p>HR will be notified for records and policy compliance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'my-requests':
        return (
          <div className={styles.content}>
            <div className={styles.detailHeader}>
              <h2>My Travel Requests {filter !== "All" ? `- ${filter.charAt(0).toUpperCase() + filter.slice(1)}` : ""}</h2>
              <button onClick={() => goto("new-request")} className={styles.btnPrimary}>
                <FaPlus className={styles.btnIconSvg} /> New Request
              </button>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeaderFlex}>
                <div className={styles.filterButtons}>
                  {["All", "pending", "approved", "rejected", "draft"].map((x) => (
                    <button
                      key={x}
                      onClick={() => setFilter(x)}
                      className={`${styles.filterBtn} ${filter === x ? styles.filterBtnActive : ''}`}
                    >
                      {x[0].toUpperCase() + x.slice(1)}
                    </button>
                  ))}
                </div>
                <div className={styles.searchBox}>
                  <FaSearch className={styles.searchIcon} />
                  <input type="text" placeholder="Search requests..." className={styles.searchInput} />
                </div>
              </div>

              <div className={styles.cardBody}>
                <table>
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Destination</th>
                      <th>Dates</th>
                      <th>Current Stage</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((r) => (
                      <tr key={r.id}>
                        <td>{r.id}</td>
                        <td>{r.destination}</td>
                        <td>{r.dates}</td>
                        <td>{r.stage}</td>
                        <td>
                          <span className={`${styles.status} ${styles[r.status]}`}>
                            {r.status[0].toUpperCase() + r.status.slice(1)}
                          </span>
                        </td>
                        <td>
                          <button 
                            className={styles.btnIcon}
                            onClick={() => {
                              setSelectedId(r.id);
                              goto("request-detail");
                            }}
                            title="View"
                          >
                            <FaEye />
                          </button>
                          {r.status === "draft" && (
                            <button className={styles.btnIcon} title="Edit">
                              ✎
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      
      case 'profile':
        return (
          <div className={styles.content}>
            <h2>User Profile</h2>
            <p>Manage your personal information and account settings</p>
            
            <div className={styles.profileContainer}>
              <div className={`${styles.card} ${styles.profileCard}`}>
                <div className={styles.cardBody}>
                  <img 
                    src="https://ui-avatars.com/api/?name=John+Doe&background=3a7bb8&color=fff&size=150" 
                    alt="Profile" 
                    className={styles.profileImage}
                  />
                  <h3>John Doe</h3>
                  <p>Marketing Manager</p>
                  <div style={{margin: '20px 0'}}>
                    <span className={`${styles.status} ${styles.approved}`}>Active</span>
                  </div>
                  <button className={styles.btnPrimary} style={{marginBottom: '10px'}}>
                    <FaUser className={styles.btnIconSvg} /> Edit Profile
                  </button>
                  <button className={styles.btn}>
                    <FaUser className={styles.btnIconSvg} /> Change Photo
                  </button>
                </div>
              </div>
              
              <div className={`${styles.card} ${styles.profileDetails}`}>
                <div className={styles.cardHeader}>
                  <h3>Personal Information</h3>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.detailItem}>
                    <label>Full Name</label>
                    <p>John Michael Doe</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Employee ID</label>
                    <p>E12345</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Email Address</label>
                    <p>john.doe@company.com</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Phone Number</label>
                    <p>+1 (555) 123-4567</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Department</label>
                    <p>Marketing</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Position</label>
                    <p>Marketing Manager</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Location</label>
                    <p>New York, USA</p>
                  </div>
                  <div className={styles.detailItem}>
                    <label>Date Joined</label>
                    <p>January 15, 2020</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'help':
        return (
          <div className={styles.content}>
            <h2>Help & Support</h2>
            <p>Get assistance with using the TTMS</p>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <p>Help articles and support contact information will be displayed here.</p>
              </div>
            </div>
          </div>
        );
      
      case 'logout':
        return (
          <div className={styles.content}>
            <h2>Logout</h2>
            <p>You are being logged out of the system</p>
            <div className={styles.card}>
              <div className={styles.cardBody}>
                <p>Thank you for using the Travel Ticket Management System.</p>
                <button 
                  className={`${styles.btnPrimary} ${styles.btnlogout}`}
                  onClick={() => {
                    if (window.confirm("Are you sure you want to logout?")) {
                      alert("You have been logged out successfully.");
                      window.location.reload();
                    }
                  }}
                >
                  Confirm Logout
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <div className={styles.content}>Select a menu item</div>;
    }
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <div className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <h2><img src='/BWCLOGO.png' alt="BWC Labs Logo" /> BWC Labs</h2>
          <button className={styles.sidebarToggle} onClick={() => setSidebarOpen(false)}>
            <FaTimes />
          </button>
        </div>
        <div className={styles.sidebarMenu}>
          <div 
            className={`${styles.menuItem} ${activeContent === 'dashboard' ? styles.active : ''}`}
            onClick={() => goto('dashboard')}
          >
            <FaSuitcase className={styles.menuIcon} />
            <span>Dashboard</span>
          </div>
          <div 
            className={`${styles.menuItem} ${activeContent === 'new-request' ? styles.active : ''}`}
            onClick={() => goto('new-request')}
          >
            <FaPlusCircle className={styles.menuIcon} />
            <span>New Request</span>
          </div>
          <div 
            className={`${styles.menuItem} ${activeContent === 'my-requests' ? styles.active : ''}`}
            onClick={() => goto('my-requests')}
          >
            <FaList className={styles.menuIcon} />
            <span>My Requests</span>
          </div>
          <div 
            className={`${styles.menuItem} ${activeContent === 'request-detail' ? styles.active : ''}`}
            onClick={() => goto('request-detail')}
          >
            <FaTasks className={styles.menuIcon} />
            <span>Request Details</span>
          </div>
          <div 
            className={`${styles.menuItem} ${activeContent === 'profile' ? styles.active : ''}`}
            onClick={() => goto('profile')}
          >
            <FaUser className={styles.menuIcon} />
            <span>Profile</span>
          </div>
          
          <div 
            className={`${styles.menuItem} ${activeContent === 'help' ? styles.active : ''}`}
            onClick={() => goto('help')}
          >
            <FaInfoCircle className={styles.menuIcon} />
            <span>Help & Support</span>
          </div>
          <div 
            className={styles.menuItem}
            onClick={() => goto('logout')}
          >
            <FaSignOutAlt className={styles.menuIcon} />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <button className={styles.mobileMenuBtn} onClick={() => setSidebarOpen(true)}>
              <FaBars />
            </button>
            <h1>Travel Management System</h1>
          </div>
          <div className={styles.userInfo}>
            <button className={styles.notificationBtn}>
              <FaBell />
              <span className={styles.notificationBadge}></span>
            </button>
            <div className={styles.userProfile}>
              <img src={avatar} alt="User" />
              <div>
                <div>John Doe</div>
                <small>Employee ID: E12345</small>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {renderContent()}

        {/* Logout Floating Button */}
        <button
          className={styles.logoutFloatBtn}
          onClick={() => {
            if (window.confirm("Are you sure you want to go back?")) {
              window.location.reload();
            }
          }}
        >
          <FaSignOutAlt className={styles.btnIconSvg} />Back
        </button>
      </div>
    </div>
  );
};

// Missing icon from FA bundle above
const FaUtensils = (props) => (
  <svg
    viewBox="0 0 512 512"
    xmlns="http://www.w3.org/2000/svg"
    className={"inline-block w-4 h-4"}
    {...props}
  >
    <path d="M192 48c-44.2 0-80 57.3-80 128s35.8 128 80 128 80-57.3 80-128-35.8-128-80-128zm0 224c-26.5 0-48-43-48-96s21.5-96 48-96 48 43 48 96-21.5 96-48 96zM416 48h-32v192h-32V48h-32v192h-32V48h-32v224h160V48z" />
  </svg>
);

export default UserModule;