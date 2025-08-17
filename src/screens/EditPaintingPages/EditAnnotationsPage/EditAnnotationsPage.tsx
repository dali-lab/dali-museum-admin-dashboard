import { Navigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pick } from "lodash";
import { HexColorPicker } from "react-colorful";
import "../styles.scss";
import { ROUTES } from "@/utils/constants";
import { getPainting, updatePainting } from "@/api/paintings";
import { IAnnotation, IPainting } from "@/types/painting";
import { AnnotationCircle, OpenAnnotation } from "./Annotations";
import TextInput from "@/components/TextInput";
import { useElementSize } from "@/hooks/useElementSize";

const EditAnnotationsPage: React.FC = () => {
  const { paintingId } = useParams();

  const {
    data: painting,
    isLoading,
    isFetched,
  } = getPainting(paintingId ?? "");

  // -------- annotation color and dark text -----------
  const initialForm = useMemo(
    () => ({
      annotationColor: painting?.annotationColor ?? "#000000",
      darkText: painting?.darkText ?? false,
    }),
    [painting]
  );
  const [form, setForm] = useState(initialForm);
  const updateForm = useCallback(
    (change: Partial<IPainting>) => {
      setForm((prev) => ({ ...prev, ...change }));
    },
    [setForm]
  );

  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);

  // ---------- image canvas size and position --------------
  // i need this to set the size of the row of buttons under the painting
  const imageRect = useElementSize("painting-image", [painting]);

  // --------- annotations --------------
  const [annotations, setAnnotations] = useState<IAnnotation[]>(
    painting?.annotations ?? []
  );
  const [openAnnotation, setOpenAnnotation] = useState<number | null>(null);
  const [movingAnnotation, setMovingAnnotation] = useState<{
    index: number;
    absoluteX: number; // in pixels, not percentages
    absoluteY: number;
    isDragging: boolean;
  } | null>(null);

  const updateAnnotation = useCallback(
    (index: number, updatedFields: Partial<IAnnotation>) => {
      setAnnotations((prev) => {
        const updatedAnnotations = [...prev];
        updatedAnnotations[index] = {
          ...updatedAnnotations[index],
          ...updatedFields,
        };
        return updatedAnnotations;
      });
    },
    []
  );

  const reorderAnnotation = useCallback(
    (index: number, direction: number) => {
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= annotations.length) {
        return; // if out of bounds, do nothing
      }

      setAnnotations((prev) => {
        const updatedAnnotations = [...prev];
        // swap index and newIndex
        const movedAnnotation = updatedAnnotations[index];
        updatedAnnotations[index] = updatedAnnotations[newIndex];
        updatedAnnotations[newIndex] = movedAnnotation;
        return updatedAnnotations;
      });
      // select the new index (of the same annotation)
      setOpenAnnotation((prev) => {
        if (prev === null) return null;
        return newIndex;
      });
    },
    [annotations.length]
  );

  const createAnnotation = useCallback(
    (x: number, y: number) => {
      const newAnnotationIndex = annotations.length;
      setAnnotations((prev) => {
        const newAnnotation: IAnnotation = {
          x: x / imageRect.width,
          y: y / imageRect.height,
          title: "",
          text: "",
        };
        return [...prev, newAnnotation];
      });
      setOpenAnnotation(newAnnotationIndex);
    },
    [annotations.length, imageRect.height, imageRect.width]
  );

  const deleteAnnotation = useCallback(
    (index: number) => {
      setAnnotations((prev) => {
        const updatedAnnotations = [...prev];
        updatedAnnotations.splice(index, 1);
        return updatedAnnotations;
      });
      setOpenAnnotation(null);
    },
    [setAnnotations, setOpenAnnotation]
  );

  // ------------ dragging annotations --------------
  // add onMouseMove and onMouseUp listeners on entire window to make dragging work better
  useEffect(() => {
    const onMouseMove = (e: any) => {
      if (!movingAnnotation) return;

      setMovingAnnotation({
        index: movingAnnotation.index,
        absoluteX: Math.max(
          0,
          Math.min(e.clientX - imageRect.x, imageRect.width)
        ),
        absoluteY: Math.max(
          0,
          Math.min(e.clientY - imageRect.y, imageRect.height)
        ),
        isDragging: true,
      });
    };

    const onMouseUp = () => {
      // if i was dragging, save new position; if not, open annotation
      if (movingAnnotation && movingAnnotation.isDragging) {
        const { index, absoluteX: x, absoluteY: y } = movingAnnotation;
        updateAnnotation(index, {
          x: x / imageRect.width,
          y: y / imageRect.height,
        });
      } else if (movingAnnotation && !movingAnnotation.isDragging) {
        setOpenAnnotation(movingAnnotation.index);
      }
      // stop moving annotation if i was moving
      setMovingAnnotation(null);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [imageRect, movingAnnotation, updateAnnotation]);

  //  ------------ painting loading and saving -------------
  // when painting is loaded, set form and annotations
  useEffect(() => {
    if (painting && initialForm) {
      setForm(initialForm);
      setAnnotations(painting.annotations ?? []);
    }
  }, [painting, initialForm]);

  const { mutate: mutateUpdatePainting } = updatePainting();

  const handleSave = useCallback(() => {
    mutateUpdatePainting(
      {
        id: paintingId,
        ...form,
        annotations: annotations.map((annotation) =>
          // remove _id. and anything else that's not accepted by the backend
          pick(annotation, ["x", "y", "title", "text"])
        ),
      },
      {
        onError: (error) => {
          alert(error.message);
        },
        onSuccess: () => {
          alert("Saved successfully!");
        },
      }
    );
  }, [annotations, form, mutateUpdatePainting, paintingId]);

  const handleDiscardChanges = useCallback(() => {
    if (painting) {
      setAnnotations(painting?.annotations ?? []);
      setForm(initialForm);
    }
  }, [initialForm, painting, setAnnotations]);

  if (isLoading) return <p>Loading...</p>;
  if (isFetched && !painting) return <Navigate to={ROUTES.NOT_FOUND} />;
  if (!painting) return null;

  return (
    <div
      className="annotations-page"
      onClick={(e) => {
        // if user clicked outside the painting, close the open annotation
        if (
          e.clientX > imageRect.x &&
          e.clientX < imageRect.x + imageRect.width &&
          e.clientY > imageRect.y &&
          e.clientY < imageRect.y + imageRect.height
        ) {
          return;
        }
        setOpenAnnotation(null);
      }}
    >
      <div className="image-container" id="painting-canvas">
        <img
          id="painting-image"
          src={painting.url}
          width="100%"
          height="100%"
          onClick={(e) => {
            // if an annotation is open, close it. else create a new annotation
            if (openAnnotation !== null) {
              setOpenAnnotation(null);
            } else {
              createAnnotation(
                e.clientX - imageRect.x,
                e.clientY - imageRect.y
              );
            }
          }}
        />
        {annotations.map((annotation, index) => {
          const absoluteX = annotation.x * imageRect.width;
          const absoluteY = annotation.y * imageRect.height;
          return index === openAnnotation ? (
            <OpenAnnotation
              x={absoluteX}
              y={absoluteY}
              index={index}
              annotationsLength={annotations.length}
              color={form.annotationColor}
              title={annotation.title}
              text={annotation.text}
              reorderAnnotation={(direction) =>
                reorderAnnotation(index, direction)
              }
              deleteAnnotation={() => deleteAnnotation(index)}
              editAnnotation={(fields) => updateAnnotation(index, fields)}
              closeAnnotation={() => setOpenAnnotation(null)}
            />
          ) : (
            <AnnotationCircle
              x={
                movingAnnotation?.index == index
                  ? movingAnnotation.absoluteX
                  : absoluteX
              }
              y={
                movingAnnotation?.index == index
                  ? movingAnnotation.absoluteY
                  : absoluteY
              }
              index={index}
              color={form.annotationColor}
              onMouseDown={() => {
                setMovingAnnotation({
                  index,
                  absoluteX: absoluteX,
                  absoluteY: absoluteY,
                  isDragging: false,
                });
              }}
            />
          );
        })}
      </div>
      <div className="form-container" style={{ width: imageRect.width }}>
        <div
          style={{ position: "relative" }}
          onFocus={() => setIsColorPickerOpen(true)}
          onBlur={() => setIsColorPickerOpen(false)}
        >
          <TextInput
            label="Annotation color"
            value={form.annotationColor}
            onChange={(value) => updateForm({ annotationColor: value })}
          />
          {isColorPickerOpen && (
            <HexColorPicker
              className="color-picker"
              color={form.annotationColor}
              onChange={(value) => updateForm({ annotationColor: value })}
            />
          )}
        </div>

        <button className="danger" onClick={handleDiscardChanges}>
          Discard changes
        </button>

        <button className="primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditAnnotationsPage;
