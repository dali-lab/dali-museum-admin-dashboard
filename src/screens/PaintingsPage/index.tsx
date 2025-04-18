import React, { useCallback } from "react";
import PageHeader from "@/components/PageHeader";
import Toggle from "@/components/Toggle";
import { getPaintings, createPainting, updatePainting } from "@/api/paintings";
import { paintingFeatures } from "@/utils";
import Tag from "@/components/Tag";
import "./styles.scss";

function PaintingsPage() {
  const { data: paintings, isLoading } = getPaintings();

  const { mutate: mutateCreatePainting } = createPainting();
  const { mutate: mutateUpdatePainting } = updatePainting();

  // TODO
  const handleUploadPaintingSubmit = useCallback(() => {
    // upload painting to s3...
    const url = "s3 url";

    // make create painting request to backend
    mutateCreatePainting({
      url,
    });

    // navigate to painting editing pages
  }, []);

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
    []
  );

  const handleEditPainting = () => {
    // navigate to painting editing pages
  };

  return (
    <>
      <PageHeader title={"Manage HDIL"}></PageHeader>
      <div className="paintings-container">
        <div
          style={{
            alignSelf: "flex-end",
            display: "flex",
            flexDirection: "row",
            gap: "8px",
          }}
        >
          <input placeholder="search"></input>
          <button onClick={() => handleUploadPaintingSubmit()}>Add New</button>
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
                paintings?.map((painting) => (
                  <tr key={painting.id}>
                    <td>
                      <img
                        className="preview"
                        src={painting.url}
                        alt={painting.name}
                      />
                    </td>
                    <td style={{ textAlign: "left" }}>
                      <p>{painting.name}</p>
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
                      <button onClick={() => handleEditPainting()}>Edit</button>
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
