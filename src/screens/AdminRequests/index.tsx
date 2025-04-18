import React, { useState } from "react";
import "./AdminRequests.css";

// Define interfaces for type safety
interface RequestItem {
  id: number;
  name: string;
  date: string;
  status: string;
}

const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<RequestItem[]>([
    {
      id: 1,
      name: "Ramina Askarova",
      date: "MM/DD/YY",
      status: "Needs Review",
    },
    {
      id: 2,
      name: "Name Last name",
      date: "MM/DD/YY",
      status: "Needs Review",
    },
  ]);

  const [admins, setAdmins] = useState<RequestItem[]>([
    {
      id: 1,
      name: "Name Last",
      date: "MM/DD/YY",
      status: "Approved",
    },
  ]);

  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<RequestItem | null>(null);

  const handleApproveClick = (user: RequestItem): void => {
    setCurrentUser(user);
    setShowApproveModal(true);
  };

  const handleConfirmApprove = (): void => {
    setShowApproveModal(false);
    setShowSuccessModal(true);
  };

  const completeApproval = (): void => {
    setShowSuccessModal(false);
    
    if (currentUser) {
      // Remove from requests
      const updatedRequests = requests.filter(
        (request) => request.id !== currentUser.id,
      );
      setRequests(updatedRequests);
      
      // Add to admins
      setAdmins([
        ...admins,
        {
          id: currentUser.id,
          name: currentUser.name,
          date: currentUser.date,
          status: "Approved",
        },
      ]);
    }
  };

  return (
    <div className="admin-page">
      <div className="header">
        <div className="icons">
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />
          </svg>
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
          </svg>
          <svg className="icon" viewBox="0 0 24 24">
            <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
          </svg>
        </div>
      </div>

      <div className="title">Admin Requests</div>

      <div className="container">
        <div className="section-title">Active</div>
        <div className="table-header">
          <div>Name</div>
          <div>Date Submitted</div>
          <div>Status</div>
          <div></div>
        </div>

        {requests.map((request) => (
          <div className="table-row" key={request.id}>
            <div>{request.name}</div>
            <div>{request.date}</div>
            <div className="status">
              <div className="status-text">Needs Review</div>
            </div>
            <div className="actions">
              <button className="deny-btn">Deny</button>
              <button
                className="approve-btn"
                onClick={() => handleApproveClick(request)}
              >
                Approve
              </button>
            </div>
          </div>
        ))}

        <div className="section-divider"></div>

        <div className="section-title">Current Admins</div>
        <div className="current-admins-header">
          <div>Name</div>
          <div>Date</div>
          <div>Status</div>
        </div>

        {admins.map((admin) => (
          <div className="current-admins-row" key={admin.id}>
            <div>{admin.name}</div>
            <div>{admin.date}</div>
            <div className="approved">Approved</div>
          </div>
        ))}
      </div>

      <div className="footer">
        <div className="logo-container">
          <svg className="logo" viewBox="0 0 100 40">
            <text x="10" y="30" fill="white" fontSize="24">DALI</text>
          </svg>
        </div>
        <div className="help-text">how do i | ◯ ◯ k?</div>
      </div>

      {/* Approve Confirmation Modal */}
      {showApproveModal && currentUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowApproveModal(false)}>
              &times;
            </span>
            <div className="modal-title">
              Are you sure you want to approve {currentUser.name}'s admin request?
            </div>
            <div className="modal-text">
              This grants them full access to the HDIL admin dashboard, including settings, data, and editing permissions.
            </div>
            <div className="modal-buttons">
              <button
                className="modal-btn no-btn"
                onClick={() => setShowApproveModal(false)}
              >
                No
              </button>
              <button
                className="modal-btn yes-btn"
                onClick={handleConfirmApprove}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && currentUser && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => setShowSuccessModal(false)}>
              &times;
            </span>
            <div className="modal-title">Admin Access Approved</div>
            <div className="modal-text">
              You have successfully granted {currentUser.name} access to the HDIL admin dashboard. They now have credentials and full permissions.
            </div>
            <div className="modal-buttons">
              <button
                className="modal-btn ok-btn"
                onClick={completeApproval}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRequests;