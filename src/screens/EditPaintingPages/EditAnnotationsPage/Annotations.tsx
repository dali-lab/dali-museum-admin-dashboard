import { contrastingColor } from "@/utils";
import { BsChevronDown, BsChevronUp, BsTrash } from "react-icons/bs";
import TextInput from "@/components/TextInput";

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
  return (
    <div
      className="annotation-open"
      style={{
        top: y,
        left: x,
        backgroundColor: color,
        color: contrastingColor(color),
      }}
    >
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
        <div className="delete-icon" onClick={() => deleteAnnotation()}>
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
