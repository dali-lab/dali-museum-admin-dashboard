import { contrastingColor } from "@/utils";
import { BsChevronDown, BsChevronUp, BsTrash } from "react-icons/bs";
import TextInput from "@/components/TextInput";
import { useState } from "react";

interface AnnotationCircleProps {
  x: number;
  y: number;
  index: number;
  color: string;
  onClick?: () => void;
  onMouseDown?: (e: React.MouseEvent) => void;
}

export const AnnotationCircle: React.FC<AnnotationCircleProps> = ({
  x,
  y,
  index,
  color,
  onClick,
  onMouseDown,
}) => {
  return (
    <div
      className="annotation-circle"
      style={{
        top: y,
        left: x,
        backgroundColor: color,
        color: contrastingColor(color),
      }}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      <h3>{index + 1}</h3>
    </div>
  );
};

interface OpenAnnotationProps {
  x: number;
  y: number;
  index: number;
  annotationsLength: number;
  color: string;
  title: string;
  text: string;
  editAnnotation: (fields: { title?: string; text?: string }) => void;
  reorderAnnotation: (direction: number) => void;
  closeAnnotation: () => void;
  deleteAnnotation: () => void;
}

export const OpenAnnotation: React.FC<OpenAnnotationProps> = ({
  x,
  y,
  index,
  annotationsLength,
  color,
  title,
  text,
  editAnnotation,
  reorderAnnotation,
  closeAnnotation,
  deleteAnnotation,
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div
      className="annotation-open"
      style={{
        top: y,
        left: x,
        backgroundColor: color,
        color: contrastingColor(color),
        padding: confirmDelete ? "0px" : undefined,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {confirmDelete ? (
        <div
          className="confirm-delete"
          style={{
            backgroundColor: color,
            color: contrastingColor(color),
          }}
        >
          Are you sure you want to remove this annotation?
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              width: "100%",
            }}
          >
            <button onClick={() => setConfirmDelete(false)}>Cancel</button>
            <button className="danger" onClick={() => deleteAnnotation()}>
              Remove
            </button>
          </div>
          Don't forget to save your changes when you're done, or press "Discard
          changes" to undo.
        </div>
      ) : null}

      <div className="annotation-header">
        <BsChevronUp
          onClick={() => reorderAnnotation(-1)}
          size={20}
          className={`icon-button ${index === 0 ? "disabled" : ""}`}
        />
        <h3 onClick={closeAnnotation}>{index + 1}</h3>
        <BsChevronDown
          onClick={() => reorderAnnotation(1)}
          size={20}
          className={`icon-button ${
            index === annotationsLength - 1 ? "disabled" : ""
          }`}
        />
        <div className="delete-icon" onClick={() => setConfirmDelete(true)}>
          <BsTrash size={20} />
        </div>
      </div>

      <div className="annotation-form">
        <TextInput
          label="Title"
          value={title}
          onChange={(value) => editAnnotation({ title: value })}
        />
        <TextInput
          label="Text"
          type="textarea"
          rows={3}
          value={text}
          onChange={(value) => editAnnotation({ text: value })}
        />
      </div>
    </div>
  );
};
