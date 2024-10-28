import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ElectionModal from "./ElectionAuthModal";
import { useEffect, useState } from "react";
import { backendUrl } from "../../backendUrl";
import { useNavigate } from "react-router-dom";
import NoDataComponent from "../user/NoDataComponent";
function ElectionItem({ electionList, usedIn }) {
  const [electionItems, setElectionItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(usedIn == "admin");
  const url = backendUrl();
  const [modalShow, setModalShow] = useState(false);
  const [modalId, setModalId] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    setElectionItems(electionList);
    setIsAdmin(usedIn == "admin");
  }, [electionList, isAdmin]);
  console.log(isAdmin);
  const handleShowModal = (access, id) => {
    if (access === "OPEN_FOR_ALL") {
      if (isAdmin) navigate(`/admin/election/details/${id}`);
      else navigate(`/election_voting/${id}`);
    } else {
      setModalShow(true);
      setModalId(id);
    }
  };
  function showResult(id) {
    navigate(`/result/${id}`);
  }
  if (electionList.length == 0) {
    return <NoDataComponent />;
  }
  return (
    <>
      {electionItems.map((item, index) => {
        return (
          <Card key={index} className="mb-2" style={{ width: "100%" }}>
            <Card.Body className=" row mt-2" style={{ width: "100%" }}>
              <div className="col-12 col-md-8 mt-2">
                <Card.Title>
                  {item.election_name} (Active till : {item.expiry_date})
                </Card.Title>
                <Card.Text style={{ color: "black" }}>
                  {item.created_by_admin ? (
                    <div>Create by: {item.created_by_admin.full_name}</div>
                  ) : null}
                  <div>Candidates: {item.candidates_count}</div>
                </Card.Text>
              </div>
              <div className="col-12 col-md-4 d-flex justify-content-end align-items-center gap-2 mt-2 mt-md-0">
                {" "}
                {new Date(item.expiry_date) > new Date() && (
                  <Button
                    variant="primary"
                    onClick={() => handleShowModal(item.access_type, item.id)}
                  >
                    Open
                  </Button>
                )}
                {item.status == "Open" && (
                  <Button variant="primary" onClick={() => showResult(item.id)}>
                    Close Election
                  </Button>
                )}
                <Button variant="primary" onClick={() => showResult(item.id)}>
                  Result
                </Button>
              </div>
            </Card.Body>
          </Card>
        );
      })}
      <ElectionModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        id={modalId}
      />
    </>
  );
}

export default ElectionItem;
