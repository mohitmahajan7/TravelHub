import React from 'react';
import { 
  FaCheckCircle, 
  FaInfoCircle, 
  FaFilePdf, 
  FaFileWord, 
  FaFileExcel, 
  FaFileImage, 
  FaDownload,
  FaArrowLeft,
  FaPaperclip
} from "react-icons/fa";
import Milestone from '../../common/Milestone/Milestone.jsx';
import DocumentCard from '../../common/DocumentCard/DocumentCard.jsx';
import styles from './RequestDetail.module.css';

const RequestDetail = ({ 
  request, 
  onBack, 
  onNavigate 
}) => {
  if (!request) {
    return (
      <div className="card">
        <div className="detailHeader">
          <h2>Request Not Found</h2>
          <button onClick={onBack} className="btnSecondary">
            <FaArrowLeft className="btnIcon" /> Back to Requests
          </button>
        </div>
        <div className="card">
          <div className="cardBody">
            <p>The requested travel request could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusDisplay = (status) => {
    const statusMap = {
      pending: "Pending Approval",
      approved: "Approved",
      booked: "Booked",
      rejected: "Rejected",
      draft: "Draft"
    };
    return statusMap[status] || status;
  };

  const documents = [
    {
      id: 1,
      icon: <FaFilePdf className="docIconPdf" />,
      title: "Flight Booking Confirmation",
      description: "Round trip flight - Business Class",
      date: "Aug 15, 2023",
      size: "1.2 MB"
    },
    {
      id: 2,
      icon: <FaFilePdf className="docIconPdf" />,
      title: "Hotel Reservation",
      description: "Executive Suite accommodation",
      date: "Aug 15, 2023",
      size: "0.8 MB"
    },
    {
      id: 3,
      icon: <FaFileWord className="docIconDoc" />,
      title: "Car Rental Agreement",
      description: "Premium Sedan rental",
      date: "Aug 16, 2023",
      size: "2.1 MB"
    },
    {
      id: 4,
      icon: <FaFileExcel className="docIconXls" />,
      title: "Expense Report Form",
      description: "Per diem and expense calculation",
      date: "Aug 16, 2023",
      size: "0.5 MB"
    }
  ];

  // Sample attachments data
  const attachments = request.attachments || [
    {
      id: 1,
      name: "conference-invitation.pdf",
      type: "pdf",
      size: "2.4 MB",
      uploadedDate: "Aug 10, 2023",
      mandatory: true
    },
    {
      id: 2,
      name: "flight-quote-screenshot.png",
      type: "image",
      size: "1.8 MB",
      uploadedDate: "Aug 10, 2023",
      mandatory: true
    },
    {
      id: 3,
      name: "hotel-quotation.pdf",
      type: "pdf",
      size: "1.5 MB",
      uploadedDate: "Aug 11, 2023",
      mandatory: false
    }
  ];

  const milestones = request.status === "draft" ? [
    { title: "Request Draft", subtitle: "Not submitted", desc: "This is a draft request", state: "active" }
  ] : request.status === "approved" || request.status === "booked" ? [
    { title: "Request Submitted", subtitle: "August 9, 2023 - 10:09 AM", desc: "You submitted the travel request for approval", state: "completed" },
    { title: "Manager Approval", subtitle: "August 6, 2023 - 9:15 AM", desc: "Sarah Johnson (Manager) approved your request", state: "completed" },
    { title: "Finance Department", subtitle: "August 7, 2023 - 11:45 AM", desc: "Finance team approved the budget", state: "completed" },
    { title: "Travel Desk", subtitle: "August 8, 2023 - 3:20 PM", desc: "Travel desk completed all bookings", state: "completed" },
    { title: "HR Notification", subtitle: "August 9, 2023 - 10:00 AM", desc: "HR has been notified for records", state: "completed" }
  ] : [
    { title: "Request Submitted", subtitle: "August 5, 2023 - 10:30 AM", desc: "You submitted the travel request for approval", state: "completed" },
    { title: "Manager Approval", subtitle: "August 6, 2023 - 9:15 AM", desc: "Sarah Johnson (Manager) approved your request", state: "completed" },
    { title: "Finance Department", subtitle: "Pending", desc: "Awaiting budget approval from Finance team", state: "active" },
    { title: "Travel Desk", subtitle: "Not started", desc: "Travel desk will book flights and accommodation" },
    { title: "HR Notification", subtitle: "Not started", desc: "HR will be notified for records" }
  ];

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'pdf':
        return <FaFilePdf className="attachmentIconPdf" />;
      case 'image':
        return <FaFileImage className="attachmentIconImage" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="attachmentIconDoc" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="attachmentIconXls" />;
      default:
        return <FaPaperclip className="attachmentIconDefault" />;
    }
  };

 // Add this to RequestDetail component
React.useEffect(() => {
  if (requestId && !request) {
    onLoadRequest(requestId);
  }
}, [requestId, request, onLoadRequest]);


  return (
    <div className="content">
      {/* Header */}
      <div className="detailHeader">
        <h2>Travel Request Details</h2>
        <button onClick={onBack} className="btnSecondary">
          <FaArrowLeft className="btnIcon" /> Back to Requests
        </button>
      </div>

      {/* Main Request Card */}
      <div className="card">
        <div className="cardHeaderFlex">
          <div>
            <h3>{request.title}</h3>
            <p>Request ID: {request.id}</p>
          </div>
          <div>
            <span className={`status ${request.status}`}>
              {getStatusDisplay(request.status)}
            </span>
          </div>
        </div>

        <div className="cardBodyGrid">
          <div className="detailSection">
            <h4>Trip Details</h4>
            <div className="detailList">
              <div className="detailItem">
                <span className="detailLabel">Destination:</span>
                <span className="detailValue">{request.destination}</span>
              </div>
              <div className="detailItem">
                <span className="detailLabel">Departure From:</span>
                <span className="detailValue">{request.from}</span>
              </div>
              <div className="detailItem">
                <span className="detailLabel">Dates:</span>
                <span className="detailValue">{request.dates}</span>
              </div>
              <div className="detailItem">
                <span className="detailLabel">Description:</span>
                <span className="detailValue">{request.description || "Annual Tech Leadership Conference"}</span>
              </div>
            </div>
          </div>

          <div className="detailSection">
            <h4>Travel Preferences</h4>
            <div className="detailList">
              <div className="detailItem">
                <span className="detailLabel">Flight:</span>
                <span className="detailValue">Business Class</span>
              </div>
              <div className="detailItem">
                <span className="detailLabel">Hotel:</span>
                <span className="detailValue">4-Star, city center</span>
              </div>
              <div className="detailItem">
                <span className="detailLabel">Transport:</span>
                <span className="detailValue">Rental car & taxi</span>
              </div>
              <div className="detailItem">
                <span className="detailLabel">Mode of Travel:</span>
                <span className="detailValue">Flight, Hotel, Local Transport</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attachments Section */}
      <div className="card">
        <div className="cardHeader">
          <h3>Attachments</h3>
          <p>Supporting documents for this travel request (PDF/Screenshot accepted)</p>
        </div>
        <div className="cardBody">
          <div className="attachmentsSection">
            <div className="attachmentsHeader">
              <span className="mandatoryNote">
                <FaInfoCircle className="infoIcon" />
                Fields marked with <span className="mandatoryStar">*</span> are mandatory
              </span>
            </div>
            
            <div className="attachmentsList">
              {attachments.map((attachment) => (
                <div key={attachment.id} className="attachmentItem">
                  <div className="attachmentIcon">
                    {getFileIcon(attachment.type)}
                    {attachment.mandatory && <span className="mandatoryBadge">*</span>}
                  </div>
                  
                  <div className="attachmentInfo">
                    <div className="attachmentName">
                      {attachment.name}
                      {attachment.mandatory && <span className="mandatoryIndicator">Required</span>}
                    </div>
                    <div className="attachmentMeta">
                      <span className="attachmentSize">{attachment.size}</span>
                      <span className="attachmentDate">Uploaded: {attachment.uploadedDate}</span>
                    </div>
                  </div>
                  
                  <div className="attachmentActions">
                    <button className="downloadBtn" title="Download attachment">
                      <FaDownload />
                    </button>
                    <span className={`attachmentStatus ${attachment.mandatory ? 'mandatory' : 'optional'}`}>
                      {attachment.mandatory ? 'Mandatory' : 'Optional'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="attachmentsSummary">
              <div className="summaryItem">
                <span>Total Attachments:</span>
                <strong>{attachments.length}</strong>
              </div>
              <div className="summaryItem">
                <span>Mandatory Files:</span>
                <strong className="mandatoryCount">
                  {attachments.filter(a => a.mandatory).length}
                </strong>
              </div>
              <div className="summaryItem">
                <span>Status:</span>
                <span className="attachmentsStatusComplete">
                  {attachments.filter(a => a.mandatory).length > 0 ? 'Complete' : 'Incomplete'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Process Completed Banner */}
      {(request.status === "approved" || request.status === "booked") && (
        <div className="card processCard">
          <div className="processComplete">
            <FaCheckCircle className="processCompleteIcon" />
            <div>
              <h4>Process Completed</h4>
              <p>Your travel request has been fully processed and all arrangements have been made.</p>
            </div>
          </div>
        </div>
      )}

      {/* Approval Process */}
      <div className="card">
        <div className="cardHeader">
          <h3>Approval Process</h3>
          <p>Track the progress of your request through the approval workflow</p>
        </div>
        <div className="cardBody">
          {request.status === "draft" ? (
            <div className="draftNotice">
              <FaInfoCircle className="draftNoticeIcon" />
              <p>This is a draft request. Submit it to start the approval process.</p>
            </div>
          ) : (
            <div className="milestones">
              {milestones.map((milestone, index) => (
                <Milestone
                  key={index}
                  title={milestone.title}
                  subtitle={milestone.subtitle}
                  desc={milestone.desc}
                  state={milestone.state}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Travel Documents - Only show for approved/booked requests */}
      {(request.status === "approved" || request.status === "booked") && (
        <div className="card">
          <div className="cardHeader">
            <h3>Travel Documents</h3>
            <p>Download your travel documents and itineraries</p>
          </div>
          <div className="cardBody">
            <div className="documentsGrid">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  icon={doc.icon}
                  title={doc.title}
                  description={doc.description}
                  date={doc.date}
                  size={doc.size}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="formActions">
        {request.status === "draft" && (
          <button 
            className="btnPrimary"
            onClick={() => onNavigate && onNavigate("new-request", request.id)}
          >
            Edit Draft
          </button>
        )}
        <button 
          className="btnSecondary"
          onClick={() => onNavigate && onNavigate("my-requests")}
        >
          View All Requests
        </button>
      </div>
    </div>
  );
};

export default RequestDetail;