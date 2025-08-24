import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pick } from "lodash";
import "./styles.scss";
import { ROUTES } from "@/utils/constants";
import {
  createPostviewImage,
  getActivePostviewImage,
  removePostviewImage,
  updatePostviewImage,
} from "@/api/postviewImages";
import UploadFileButton from "@/components/UploadFileButton";
import { getPainting } from "@/api/paintings";
import { IPostviewImage } from "@/types/postviewImage";
import TextInput from "@/components/TextInput";

const EditPostviewImagePage: React.FC = () => {
  const navigate = useNavigate();
  const { paintingId } = useParams();
  useEffect(() => {
    if (!paintingId) {
      navigate(ROUTES.PAINTINGS);
    }
  }, [navigate, paintingId]);

  const { data: painting, isLoading: isPaintingLoading } = getPainting(
    paintingId ?? ""
  );

  const { data: postviewImage, isLoading } = getActivePostviewImage(
    painting?.activePostviewImage ?? ""
  );

  const initialForm = useMemo(
    () => (postviewImage ? pick(postviewImage, ["name", "description"]) : {}),
    [postviewImage]
  );

  const [form, setForm] = useState<Partial<IPostviewImage>>(initialForm);
  const updateForm = useCallback(
    (change: Partial<IPostviewImage>) => {
      setForm((prev) => ({ ...prev, ...change }));
    },
    [setForm]
  );

  // when painting is loaded, set form
  useEffect(() => {
    if (postviewImage && initialForm) {
      setForm(initialForm);
    }
  }, [postviewImage, initialForm]);

  const { mutate: mutateUpdatePostviewImage } = updatePostviewImage();

  const handleSaveDetails = useCallback(() => {
    if (!postviewImage) return;
    mutateUpdatePostviewImage(
      { id: postviewImage.id, ...form },
      {
        onError: (error) => {
          alert(error.message);
        },
        onSuccess: () => {
          alert("Saved successfully!");
        },
      }
    );
  }, [form, mutateUpdatePostviewImage, postviewImage]);

  const { mutate: mutateCreatePostviewImage, isPending } =
    createPostviewImage();
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

  if (isPaintingLoading || isLoading) return <p>Loading...</p>;

  return (
    <div className="postview-page">
      {postviewImage ? (
        <div className="postview-container">
          <div className="image-column">
            <img
              id="postview-image"
              className="postview-image"
              src={postviewImage.url}
            />
            <div className="postview-buttons">
              <button onClick={handleRemovePostviewImage}>Remove</button>
              <UploadFileButton handleUpload={handleUploadPostviewImageSubmit}>
                {isPending ? "Loading..." : "Change Image"}
              </UploadFileButton>
            </div>
          </div>
          <div className="details-form">
            <TextInput
              label="Title"
              value={form.name}
              onChange={(value) => updateForm({ name: value })}
            />
            <TextInput
              label="Description"
              type="textarea"
              rows={2}
              value={form.description}
              onChange={(value) => updateForm({ description: value })}
            />
            <button className="primary" onClick={handleSaveDetails}>
              Save
            </button>
          </div>
        </div>
      ) : (
        <div className="no-postview-image">
          <h3>Nothing here yet...</h3>
          <UploadFileButton
            handleUpload={handleUploadPostviewImageSubmit}
            type="primary"
          >
            {isPending ? "Loading..." : null}
          </UploadFileButton>
        </div>
      )}
    </div>
  );
};

export default EditPostviewImagePage;
