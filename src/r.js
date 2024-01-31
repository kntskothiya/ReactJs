import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";
import { FaSquarePlus } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.min.css";
import moment from "moment";

function App() {
  let [inputdata, setinputdata] = useState("");
  let [listitem, setlistitem] = useState([]);
  let [editindex, seteditindex] = useState(null);
  let [itemtask, setitemtask] = useState([]);
  let [filteritems, setfilteritems] = useState("all");

  let filtertask = (status) => {
    setfilteritems(status);
  };

  function additems() {
    if (inputdata === "") {
      return;
    }
    if (editindex !== null) {
      setlistitem((prevItems) => {
        let updatedItems = [...prevItems];
        updatedItems[editindex] = inputdata;
        return updatedItems;
      });

      setitemtask((prevStates) => {
        let updatedStates = [...prevStates];
        updatedStates[editindex] = {
          ...updatedStates[editindex],
          inputdata: inputdata,
        };
        return updatedStates;
      });

      seteditindex(null);

      let updatedLocalStorage = [...itemtask];
      updatedLocalStorage[editindex] = {
        ...updatedLocalStorage[editindex],
        inputdata: inputdata,
      };
      localStorage.setItem("info", JSON.stringify(updatedLocalStorage));
    } else {
      setlistitem([...listitem, inputdata]);
      setitemtask([
        ...itemtask,
        {
          inputdata,
          runtime: false,
          pcolor: "#0b5ed7",
          oncolor: "",
          ccolor: "",
          strike: "",
          seconds: 0,
          stime: "",
          etime: "",
        },
      ]);

      localStorage.setItem(
        "info",
        JSON.stringify([
          ...itemtask,
          {
            inputdata,
            runtime: false,
            pcolor: "#0b5ed7",
            oncolor: "",
            ccolor: "",
            strike: "",
            seconds: 0,
            stime: "",
            etime: "",
          },
        ])
      );
    }
    setinputdata("");
  }

  function enterkey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      additems();
    }
  }

  function clearall() {
    setlistitem([]);
    localStorage.clear();
  }

  function deleteitems(id) {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        let deleteitem = listitem.filter((element, index) => {
          return index !== id;
        });
        setlistitem(deleteitem);
        Swal.fire({
          title: "Deleted!",
          text: "Your task has been deleted.",
          icon: "success",
        });
      }
    });
  }

  useEffect(() => {
    let timers = [];

    listitem.forEach((item, index) => {
      if (itemtask[index].runtime) {
        timers[index] = setInterval(() => {
          setitemtask((prevStates) => {
            let newtask = [...prevStates];
            newtask[index] = {
              ...newtask[index],
              seconds: newtask[index].seconds + 1,
            };
            return newtask;
          });
        }, 1000);
      }
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [itemtask, listitem]);

  function start(index) {
    setitemtask((prevStates) => {
      let newtask = [...prevStates];
      newtask[index] = {
        ...newtask[index],
        runtime: true,
        strike: "",
        pcolor: "",
        oncolor: "#ffca2c",
        ccolor: "",
        stime: moment().format("hh:mm:ss A"),
      };
      updateLocalStorage(newtask);
      return newtask;
    });
  }

  function stop(index) {
    setitemtask((prevStates) => {
      let newtask = [...prevStates];
      newtask[index] = {
        ...newtask[index],
        runtime: false,
        strike: "line-through",
        pcolor: "",
        oncolor: "",
        ccolor: "#157347",
        etime: moment().format("hh:mm:ss A"),
      };
      updateLocalStorage(newtask);
      return newtask;
    });
  }

  function resettimer(index) {
    setitemtask((prevStates) => {
      let newtask = [...prevStates];
      newtask[index] = {
        ...newtask[index],
        pcolor: "#0b5ed7",
        strike: "",
        oncolor: "",
        ccolor: "",
        seconds: 0,
        runtime: false,
      };
      updateLocalStorage(newtask);
      return newtask;
    });
  }

  function updateLocalStorage(abctime) {
    localStorage.setItem("info", JSON.stringify(abctime));
  }

  function editItem(index) {
    seteditindex(index);
    setinputdata(listitem[index]);
  }

  let format = (second) => {
    let hours = Math.floor(second / 3600);
    let minutes = Math.floor((second % 3600) / 60);
    let seconds = second % 60;
    let time = (num) => (num < 10 ? `0${num}` : num);

    return `${time(hours)}:${time(minutes)}:${time(seconds)}`;
  };

  return (
    <>
      <div className="bg-img"></div>
      <div className="todo-main">
        <div className="todo-sub">
          <h1 className="todo-heading">TODO</h1>

          <div className="card border border-0">
            <div className="d-flex justify-content-center m-3">
              <input
                type="text"
                className="form-control"
                id="inputtext"
                placeholder="Create a new todo..."
                value={inputdata}
                onChange={(e) => setinputdata(e.target.value)}
                onKeyDown={enterkey}
              />

              <FaSquarePlus id="addbutton" onClick={additems} />
            </div>

            <div className="filter-buttons">
              <input
                type="button"
                className={`btn btn-sm btn-primary ${filteritems === "all" ? "active" : ""
                  }`}
                onClick={() => filtertask("all")}
                id="allitems"
                value="All"
              />
              <input
                type="button"
                className={`btn btn-sm btn-warning ms-4 ${filteritems === "pending" ? "active" : ""
                  }`}
                onClick={() => filtertask("pending")}
                id="pendingbtn"
                value="Pending"
              />
              <input
                type="button"
                className={`btn btn-sm btn-success ms-4 ${filteritems === "complete" ? "active" : ""
                  }`}
                onClick={() => filtertask("complete")}
                id="completebtn"
                value="Complete"
              />
              <input
                type="button"
                className="btn btn-sm btn-danger ms-4"
                id="clearall"
                onClick={clearall}
                value="Clear All"
              />
            </div>

            {listitem.map((element, index) => {
              let filter =
                filteritems === "all" ||
                (filteritems === "pending" &&
                  itemtask[index].strike === "") ||
                (filteritems === "complete" && itemtask[index].strike !== "");

              return filter ? (
                <div
                  key={index}
                  className="container d-flex justify-content-between align-items-center"
                >
                  <>
                    <span className="toggle-button me-2">
                      <input
                        style={{ backgroundColor: itemtask[index].pcolor }}
                        type="button"
                        className="toggle-buttton pending-btn"
                        onClick={() => resettimer(index)}
                        id="pending"
                      />
                      <input
                        style={{ backgroundColor: itemtask[index].oncolor }}
                        type="button"
                        className="toggle-buttton ongoing-btn"
                        onClick={() => start(index)}
                        id="ongoing"
                      />
                      <input
                        style={{ backgroundColor: itemtask[index].ccolor }}
                        type="button"
                        className="toggle-buttton completebutton-btn"
                        onClick={() => stop(index)}
                        id="done"
                      />
                    </span>
                    <p
                      className="ms-5"
                      id="todo-item"
                      style={{ textDecoration: itemtask[index].strike }}
                    >
                      {element}
                    </p>
                    <span id="stop-watch" className="ms-auto">
                      {format(itemtask[index].seconds)}
                    </span>
                    <FaPencilAlt
                      className="ms-auto fs-4"
                      onClick={() => editItem(index)}
                    />
                    <MdDelete
                      className="ms-3 fs-3"
                      onClick={() => deleteitems(index)}
                    />
                  </>
                </div>
              ) : null;
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
