import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { ROUTES } from "@/utils/constants";
import {
  createPostviewImage,
  getActivePostviewImage,
  removePostviewImage,
} from "@/api/postviewImages";
import UploadFileButton from "@/components/UploadFileButton";
import { useElementSize } from "@/hooks/useElementSize";

const EditPostviewImagePage: React.FC = () => {
  const navigate = useNavigate();
  const { paintingId } = useParams();
  useEffect(() => {
    if (!paintingId) {
      navigate(ROUTES.PAINTINGS);
    }
  }, [navigate, paintingId]);

  const { data: postviewImage, isLoading } = getActivePostviewImage(
    paintingId ?? ""
  );

  // i need the image size to resize the button row below the image
  const imageRect = useElementSize("postview-image", [postviewImage]);

  const { mutate: mutateCreatePostviewImage } = createPostviewImage();
  const { mutate: mutateRemovePostviewImage } = removePostviewImage();

  const handleUploadPostviewImageSubmit = useCallback(
    (file: File) => {
      if (!paintingId) return;
      mutateCreatePostviewImage(
        { image: file, paintingId },
        {
          onSuccess: () => {
            // alert("Successfully uploaded postview image");
          },
          onError: (error) => {
            alert(`Failed to upload postview image: ${error.message}`);
          },
        }
      );
    },
    [mutateCreatePostviewImage, paintingId]
  );

  const handleRemovePostviewImage = useCallback(() => {
    if (!postviewImage || !paintingId) return;

    mutateRemovePostviewImage(
      { id: postviewImage.id, paintingId },
      {
        onSuccess: () => {
          // alert("Successfully removed postview image");
        },
        onError: (error) => {
          alert(`Failed to remove postview image: ${error.message}`);
        },
      }
    );
  }, [mutateRemovePostviewImage, paintingId, postviewImage]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="postview-page">
      {postviewImage ? (
        <>
          <img
            id="postview-image"
            className="postview-image"
            src={postviewImage.url}
          />
          <div className="postview-buttons" style={{ width: imageRect.width }}>
            <button onClick={handleRemovePostviewImage}>Remove</button>
            <UploadFileButton handleUpload={handleUploadPostviewImageSubmit}>
              Change Image
            </UploadFileButton>
          </div>
        </>
      ) : (
        <div className="no-postview-image">
          <h3>Nothing here yet...</h3>
          <UploadFileButton
            handleUpload={handleUploadPostviewImageSubmit}
            type="primary"
          />
        </div>
      )}
    </div>
  );
};

export default EditPostviewImagePage;
