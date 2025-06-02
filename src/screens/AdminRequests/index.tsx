import React, { useState } from "react";
import "./AdminRequests.css";
import PageHeader from "@/components/PageHeader";
import { ROUTES } from "@/utils/constants";

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
        (request) => request.id !== currentUser.id
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
    <>
      <PageHeader title="Admin Requests" selected={ROUTES.ADMIN_REQUESTS} />
      <div className="admin-page">
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
              <text x="10" y="30" fill="white" fontSize="24">
                DALI
              </text>
            </svg>
          </div>
          <div className="help-text">how do i | ◯ ◯ k?</div>
        </div>

        {/* Approve Confirmation Modal */}
        {showApproveModal && currentUser && (
          <div className="modal">
            <div className="modal-content">
              <span
                className="close"
                onClick={() => setShowApproveModal(false)}
              >
                &times;
              </span>
              <div className="modal-title">
                Are you sure you want to approve {currentUser.name}'s admin
                request?
              </div>
              <div className="modal-text">
                This grants them full access to the HDIL admin dashboard,
                including settings, data, and editing permissions.
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
              <span
                className="close"
                onClick={() => setShowSuccessModal(false)}
              >
                &times;
              </span>
              <div className="modal-title">Admin Access Approved</div>
              <div className="modal-text">
                You have successfully granted {currentUser.name} access to the
                HDIL admin dashboard. They now have credentials and full
                permissions.
              </div>
              <div className="modal-buttons">
                <button className="modal-btn ok-btn" onClick={completeApproval}>
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminRequests;
