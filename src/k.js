import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useState } from "react";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/dist/sweetalert2.min.css";
import moment from "moment";

function App() {
  const [inputdata, setinputdata] = useState("");
  const [listitem, setlistitem] = useState([]);
  const [editindex, seteditindex] = useState(null);
  const [editvalue, seteditvalue] = useState("");
  const [itemStates, setItemStates] = useState([]);
  const [filteritems, setfilteritems] = useState("all");

  const handleFilterChange = (status) => {
    setfilteritems(status);
  };

  function additems() {
    if (inputdata === "") {
      alert("Enter Something");
    } else {
      setlistitem([...listitem, inputdata]);
      setItemStates([
        ...itemStates,
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
      setinputdata("");
    }
  }

  useEffect(() => {
    localStorage.setItem("info", JSON.stringify(itemStates));
  }, [itemStates]);

  function enterkey(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      additems();
    }
  }

  function clearall() {
    setlistitem([]);
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
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  }

  function editItem(index) {
    seteditindex(null);
    setinputdata(listitem[index]);
  }

  function saveEdit(index) {
    let newtext = [...listitem];
    newtext[index] = inputdata;
    setlistitem(newtext);
    setinputdata("");
  }

  useEffect(() => {
    let timers = [];

    listitem.forEach((item, index) => {
      if (itemStates[index].runtime) {
        timers[index] = setInterval(() => {
          setItemStates((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = {
              ...newStates[index],
              seconds: newStates[index].seconds + 1,
            };
            return newStates;
          });
        }, 1000);
      }
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [itemStates, listitem]);

  function start(index) {
    setItemStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = {
        ...newStates[index],
        runtime: true,
        strike: "",
        pcolor: "",
        oncolor: "#ffca2c",
        ccolor: "",
        stime: moment().format("hh:mm:ss A"),
      };
      return newStates;
    });
  }

  function stop(index) {
    setItemStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = {
        ...newStates[index],
        runtime: false,
        strike: "line-through",
        pcolor: "",
        oncolor: "",
        ccolor: "#157347",
        etime: moment().format("hh:mm:ss A"),
      };
      return newStates;
    });
  }

  function resettimer(index) {
    setItemStates((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = {
        ...newStates[index],
        pcolor: "#0b5ed7",
        strike: "",
        oncolor: "",
        ccolor: "",
        seconds: 0,
        runtime: false,
      };
      return newStates;
    });
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
      <div className="todo-main">
        <div className="todo-sub">
          <h1 className="todo-heading">TODO</h1>

          <div className="mb-3 d-flex justify-content-between">
            <input
              type="buttton"
              className={`btn btn-sm btn-secondary ${filteritems === "all" ? "active" : ""
                }`}
              onClick={() => handleFilterChange("all")}
              id="allitems"
              value="All"
            />
            <input
              type="button"
              className={`btn btn-sm btn-primary ${filteritems === "ongoing" ? "active" : ""
                }`}
              onClick={() => handleFilterChange("ongoing")}
              id="ongoing"
              value="Ongoing"
            />
            <input
              type="button"
              className={`btn btn-sm btn-warning ${filteritems === "pending" ? "active" : ""
                }`}
              onClick={() => handleFilterChange("pending")}
              id="pendingbtn"
              value="Pending"
            />
            <input
              type="button"
              className={`btn btn-sm btn-success ${filteritems === "complete" ? "active" : ""
                }`}
              onClick={() => handleFilterChange("complete")}
              id="completebtn"
              value="Complete"
            />
            <input
              type="button"
              className="btn btn-sm btn-danger"
              id="clearall"
              onClick={clearall}
              value="Clear All"
            />
          </div>

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

              <button
                className="btn btn-info ms-3"
                id="addbutton"
                onClick={additems}
              >
                <b>+</b>
              </button>
            </div>

            {listitem.map((element, index) => {
              let filter =
                filteritems === "all" ||
                (filteritems === "pending" &&
                  itemStates[index].strike === "") || (filteritems === "ongoing" && itemStates[index].strike !== "") ||
                (filteritems === "complete" && itemStates[index].strike !== "");

              return filter ? (
                <div
                  key={index}
                  className="container d-flex justify-content-between align-items-baseline"
                >
                  {editindex === index ? (
                    <>
                      <input
                        type="text"
                        className="form-control"
                        value={editvalue}
                        onChange={(e) => seteditvalue(e.target.value)}
                      />
                      <button
                        className="btn btn-success btn-sm ms-2"
                        onClick={() => saveEdit(index)}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span className="three-state-toggle mb-4 me-2">
                        <input
                          style={{ backgroundColor: itemStates[index].pcolor }}
                          type="button"
                          className="toggle-buttton pending-btn"
                          onClick={() => resettimer(index)}
                          id="pending"
                        />
                        <input
                          style={{ backgroundColor: itemStates[index].oncolor }}
                          type="button"
                          className="toggle-buttton ongoing-btn"
                          onClick={() => start(index)}
                          id="ongoing"
                        />
                        <input
                          style={{ backgroundColor: itemStates[index].ccolor }}
                          type="button"
                          className="toggle-buttton completebutton-btn"
                          onClick={() => stop(index)}
                          id="done"
                        />
                      </span>
                      <h5
                        className="ms-1"
                        id="todo-item"
                        style={{ textDecoration: itemStates[index].strike }}
                      >
                        {element}
                      </h5>
                      <span id="stop-watch" className="ms-auto">
                        {format(itemStates[index].seconds)}
                      </span>
                      <button
                        className="btn btn-success btn-sm ms-auto"
                        onClick={() => editItem(index)}
                      >
                        Edit
                      </button>
                    </>
                  )}
                  <button
                    className="btn btn-danger btn-sm ms-2"
                    onClick={() => deleteitems(index)}
                  >
                    Delete
                  </button>
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
