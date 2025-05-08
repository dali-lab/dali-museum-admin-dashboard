import { useNavigate, useParams } from "react-router-dom";
import "./styles.scss";
import { getPainting, updatePainting } from "@/api/paintings";
import { ROUTES } from "@/utils/constants";
import TextInput from "@/components/TextInput";
import { IPainting } from "@/types/painting";
import { useCallback, useEffect, useMemo, useState } from "react";
import { pick } from "lodash";

const EditBasicInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const { paintingId } = useParams();
  useEffect(() => {
    if (!paintingId) {
      navigate(ROUTES.PAINTINGS);
    }
  }, [navigate, paintingId]);

  const { data: painting, isLoading } = getPainting(paintingId ?? "");
  const initialForm = useMemo(
    () => pick(painting, ["name", "alias", "description", "year"]),
    [painting]
  );

  const [form, setForm] = useState(initialForm);
  const updateForm = useCallback(
    (change: Partial<IPainting>) => {
      setForm((prev) => ({ ...prev, ...change }));
    },
    [setForm]
  );

  // when painting is loaded, set form
  useEffect(() => {
    if (painting && initialForm) {
      setForm(initialForm);
    }
  }, [painting, initialForm]);

  const { mutate: mutateUpdatePainting } = updatePainting();

  const handleSave = useCallback(() => {
    mutateUpdatePainting(
      { id: paintingId, ...form },
      {
        onError: (error) => {
          alert(error.message);
        },
        onSuccess: () => {
          alert("Saved successfully!");
        },
      }
    );
  }, [form, mutateUpdatePainting, paintingId]);

  return (
    <div className="basic-info-page">
      <img src={painting?.url} />
      <div className="basic-info-form">
        <TextInput
          label="Full Title (displayed in the experience)"
          type="textarea"
          rows={2}
          value={form.name}
          onChange={(value) => updateForm({ name: value })}
        />
        <TextInput
          label="Alias (displayed in the admin dashboard)"
          value={form.alias}
          onChange={(value) => updateForm({ alias: value })}
        />
        <TextInput
          label="Description"
          type="textarea"
          value={form.description}
          onChange={(value) => updateForm({ description: value })}
        />
        <TextInput
          label="Year"
          type="number"
          value={form.year}
          onChange={(value) => updateForm({ year: value })}
        />
        <button className="primary" onClick={handleSave}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditBasicInfoPage;
