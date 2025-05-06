import React, { useCallback, useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import Toggle from "@/components/Toggle";
import { getPaintings, createPainting, updatePainting } from "@/api/paintings";
import { paintingFeatures } from "@/utils";
import Tag from "@/components/Tag";
import "./styles.scss";
import { Link, useNavigate } from "react-router-dom";

function PaintingsPage() {
  const navigate = useNavigate();

  const { data: paintings, isLoading } = getPaintings();

  const { mutate: mutateCreatePainting } = createPainting();
  const { mutate: mutateUpdatePainting } = updatePainting();

  const [searchTerm, setSearchTerm] = useState("");

  const handleUploadPaintingSubmit = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!event.target.files || event.target.files.length !== 1) {
        alert("Please select a single file.");
        return;
      }

      // make create painting request to backend
      // backend will upload it to s3
      mutateCreatePainting(
        { image: event.target.files[0] },
        {
          onSuccess: (newPainting) => {
            // navigate to painting editing pages
            navigate(newPainting.id);
          },
          onError: (error) => {
            alert(`Failed to upload painting: ${error.message}`);
          },
        }
      );
    },
    [mutateCreatePainting, navigate]
  );

  // handle toggle for exhibition/research modes
  const handleModeToggle = useCallback(
    (paintingId: string, which: string, value: boolean) => {
      mutateUpdatePainting(
        { id: paintingId, [which]: value },
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
    return sortedPaintings?.filter((painting) =>
      painting.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedPaintings, searchTerm]);

  return (
    <>
      <PageHeader title={"Manage HDIL"}></PageHeader>
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

          <label htmlFor="upload-painting" className="button primary">
            Upload painting
          </label>
          <input
            type="file"
            onChange={handleUploadPaintingSubmit}
            id="upload-painting"
            style={{ display: "none" }}
          />
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
                        <Toggle
                          label="Exhibition"
                          disabled={!painting.exhibitionPossible}
                          value={painting.exhibitionEnabled}
                          onChange={() =>
                            handleModeToggle(
                              painting.id,
                              "exhibitionEnabled",
                              !painting.exhibitionEnabled
                            )
                          }
                        />
                        <Toggle
                          label="Research"
                          disabled={!painting.researchPossible}
                          value={painting.researchEnabled}
                          onChange={() =>
                            handleModeToggle(
                              painting.id,
                              "researchEnabled",
                              !painting.researchEnabled
                            )
                          }
                        />
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
