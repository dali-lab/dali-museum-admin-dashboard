import React, { useCallback, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Toggle from "@/components/Toggle";
import { getPaintings, createPainting, updatePainting } from "@/api/paintings";
import { paintingFeatures } from "@/utils";
import Tag from "@/components/Tag";
import "./styles.scss";
import { Link, useNavigate } from "react-router-dom";
import UploadFileButton from "@/components/UploadFileButton";
import { MAX_PAINTINGS, MODES } from "@/utils/constants";
import { Modes } from "@/types/painting";

function PaintingsPage() {
  const navigate = useNavigate();

  const { data: paintings, isLoading } = getPaintings();

  const { mutate: mutateCreatePainting } = createPainting();
  const { mutate: mutateUpdatePainting } = updatePainting();

  const [searchTerm, setSearchTerm] = useState("");

  const handleUploadPaintingSubmit = useCallback(
    async (file: File) => {
      // make create painting request to backend
      // backend will upload it to s3
      mutateCreatePainting(
        { image: file },
        {
          onSuccess: (newPainting) => {
            // navigate to painting editing pages
            navigate(newPainting.id);
          },
          onError: (error) => {
            alert(
              `Failed to upload painting: ${error.message}. Verify that your image is less than 2MB.`
            );
          },
        }
      );
    },
    [mutateCreatePainting, navigate]
  );

  const paintingsNumber = useMemo(() => {
    const counts: Record<Modes, number> = {
      [Modes.EXHIBITION]: 0,
      [Modes.POSTVIEW]: 0,
      [Modes.COMPARATIVE]: 0,
    };
    Object.values(MODES).forEach((mode) => (counts[mode.key] = 0));

    paintings?.forEach((painting) => {
      Object.values(MODES).forEach((mode) => {
        if (painting.modesEnabled?.[mode.key]) counts[mode.key]++;
      });
    });

    return counts;
  }, [paintings]);

  // handle toggle for exhibition/research modes
  const handleModeToggle = useCallback(
    (paintingId: string, which: Modes, value: boolean) => {
      mutateUpdatePainting(
        { id: paintingId, ["modesEnabled." + MODES[which].key]: value },
        {
          onError: (error) => {
            alert(error.message);
          },
        }
      );
    },
    [mutateUpdatePainting]
  );

  const sortedPaintings = useMemo(
    () =>
      paintings
        ? [...paintings].sort((a, b) => {
            if (a.alias.toLowerCase() < b.alias.toLowerCase()) return -1;
            if (a.alias.toLowerCase() > b.alias.toLowerCase()) return 1;
            return 0;
          })
        : [],
    [paintings]
  );
  // i put these two ^ v in separate useMemos so it doesn't re-sort every time you search
  const sortedAndFilteredPaintings = useMemo(() => {
    // return only paintings that match the search term
    if (!searchTerm) return sortedPaintings;
    return sortedPaintings?.filter(
      (painting) =>
        painting.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        painting.alias?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedPaintings, searchTerm]);

  return (
    <>
      <PageHeader title={"Manage HDIL"} />
      <div className="paintings-container">
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            gap: "8px",
          }}
        >
          <input
            placeholder="search"
            style={{ width: 400 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <UploadFileButton
            handleUpload={handleUploadPaintingSubmit}
            type="primary"
          >
            Upload Painting
          </UploadFileButton>
        </div>

        <div className="paintings-table-scrollable-container">
          <table className="paintings-table">
            <thead>
              <tr>
                <th style={{ width: "15%" }}>Preview</th>
                <th style={{ width: "30%", textAlign: "left" }}>Title</th>
                <th style={{ width: "20%" }}>Mode</th>
                <th style={{ width: "15%" }}>Features</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5}>
                    <p>Loading...</p>
                  </td>
                </tr>
              ) : (
                sortedAndFilteredPaintings?.map((painting) => (
                  <tr key={painting.id}>
                    <td>
                      <img
                        className="preview"
                        src={painting.url}
                        alt={painting.name}
                      />
                    </td>
                    <td style={{ textAlign: "left" }}>
                      <p>{painting.alias}</p>
                    </td>
                    <td>
                      <div className="toggle-container">
                        {Object.values(MODES).map((mode) => (
                          <Toggle
                            key={`${painting.id}-${mode.key}`}
                            label={mode.label}
                            disabled={
                              !painting.modesEnabled?.[mode.key] &&
                              (!painting.modesPossible?.[mode.key] ||
                                paintingsNumber[mode.key] >= MAX_PAINTINGS)
                            }
                            title={
                              !painting.modesPossible?.[mode.key]
                                ? mode.conditions
                                : paintingsNumber[mode.key] >= MAX_PAINTINGS
                                  ? `Only ${MAX_PAINTINGS} paintings can be enabled in the same mode at a time. Turn off ${mode.label.toLowerCase()} mode on another painting first.`
                                  : undefined
                            }
                            value={painting.modesEnabled?.[mode.key]}
                            onChange={() =>
                              handleModeToggle(
                                painting.id,
                                mode.key,
                                !painting.modesEnabled?.[mode.key]
                              )
                            }
                          />
                        ))}
                      </div>
                    </td>
                    <td style={{ verticalAlign: "top" }}>
                      <div className="tag-container">
                        {paintingFeatures(painting).map((feature) => (
                          <Tag
                            key={feature.title}
                            label={feature.title}
                            color={feature.color}
                          />
                        ))}
                      </div>
                    </td>
                    <td>
                      <Link to={painting.id}>
                        <button className="primary">Edit</button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default PaintingsPage;
