import { approveUser, getApprovedUsers, getPendingUsers } from "@/api/users";
import React, { useCallback, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { ROUTES } from "@/utils/constants";
import "./AdminRequests.scss";
import Footer from "@/components/Footer/Footer";
import { IUser } from "@/types/users";
import Modal from "@/components/Modal";

interface ModalProps {
  userName: string;
  isOpen: boolean;
  close: () => void;
}

const ApproveModal: React.FC<ModalProps & { submit: () => void }> = ({
  userName,
  isOpen,
  close,
  submit,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={close}>
      <div className="admin-modal-content">
        <div className="modal-title">
          Are you sure you want to approve {userName}'s admin request?
        </div>
        <div className="modal-text">
          This grants them full access to the HDIL admin dashboard, including
          settings, data, and editing permissions.
        </div>
        <div className="modal-buttons">
          <button onClick={close}>Cancel</button>
          <button className="primary" onClick={submit}>
            Approve
          </button>
        </div>
      </div>
    </Modal>
  );
};

const SuccessModal: React.FC<ModalProps> = ({ isOpen, close, userName }) => {
  return (
    <Modal isOpen={isOpen} onClose={close}>
      <div className="admin-modal-content">
        <div className="modal-title">Admin Access Approved</div>
        <div className="modal-text">
          You have successfully granted {userName} access to the HDIL admin
          dashboard. They now have full permissions.
        </div>
        <div className="modal-buttons">
          <button className="modal-btn ok-btn" onClick={close}>
            OK
          </button>
        </div>
      </div>
    </Modal>
  );
};

const AdminRequests: React.FC = () => {
  const { data: pendingUsers } = getPendingUsers();
  const { data: admins } = getApprovedUsers();
  const [currentUser, setCurrentUser] = useState<IUser | null>(null);

  const { mutate: mutateApprovePendingUser } = approveUser();

  const [showApproveModal, setShowApproveModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleApproveClick = useCallback((user: IUser) => {
    setCurrentUser(user);
    setShowApproveModal(true);
  }, []);

  const handleConfirmApprove = useCallback(() => {
    if (currentUser) {
      mutateApprovePendingUser({ id: currentUser.id });
    }

    setShowApproveModal(false);
    setShowSuccessModal(true);
  }, [currentUser, mutateApprovePendingUser]);

  return (
    <>
      <PageHeader title="Admin Requests" selected={ROUTES.ADMIN_REQUESTS} />
      <div className="admin-page">
        <div className="admin-container">
          <div className="expand">
            <h2>Requests</h2>

            {pendingUsers && pendingUsers.length > 0 ? (
              <table>
                <colgroup>
                  <col />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "25%" }} />
                </colgroup>

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Date Submitted</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {pendingUsers &&
                    pendingUsers.map((request) => (
                      <tr key={request.id}>
                        <td>{request.name}</td>
                        <td>{request.createdAt.getDate()}</td>
                        <td className="status">Pending</td>
                        <td className="actions">
                          <button className="small">Deny</button>
                          <button
                            className="small primary"
                            onClick={() => handleApproveClick(request)}
                          >
                            Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p>No requests.</p>
            )}
          </div>

          <div className="expand">
            <h2>Current Admins</h2>

            <table>
              <colgroup>
                <col />
                <col style={{ width: "20%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "25%" }} />
              </colgroup>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {admins &&
                  admins.map((admin) => (
                    <tr key={admin.id}>
                      <td>{admin.name}</td>
                      <td>{admin.createdAt.getDate()}</td>
                      <td className="approved">Approved</td>
                      <td className="actions">
                        <button className="small danger">Revoke</button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Approve Confirmation Modal */}
        <ApproveModal
          isOpen={showApproveModal && !!currentUser}
          submit={handleConfirmApprove}
          userName={currentUser?.name ?? ""}
          close={() => setShowApproveModal(false)}
        />

        {/* Success Modal */}
        <SuccessModal
          isOpen={showSuccessModal && !!currentUser}
          userName={currentUser?.name ?? ""}
          close={() => setShowSuccessModal(false)}
        />
      </div>

      <Footer />
    </>
  );
};

export default AdminRequests;
