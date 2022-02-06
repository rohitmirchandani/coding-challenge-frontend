import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import "./UserForm.css";

const Marker = ({ text }) => <h1 className="marker">{text}</h1>;
export default class UserForm extends Component {
  constructor(props) {
    super(props);
    this.onChangeUser = this.onChangeUser.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.state = {
      users: [],
      selecteduser: null,
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = async () => {
    await fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        this.setState({
          users: data,
        });
      })
      .catch((err) => {
        document.getElementById("error").classList.remove("hide");
      });
  };
  submitForm(event) {
    let submit = true;
    let userwarning = document.getElementById("user-warning"),
      titlewarning = document.getElementById("title-warning"),
      bodywarning = document.getElementById("body-warning"),
      body = document.getElementById("body"),
      title = document.getElementById("title");

    event.preventDefault();

    if (document.querySelectorAll(`input[type='radio']:checked`).length === 0) {
      userwarning.classList.remove("hide");
      submit = false;
    }
    if (title.value.trim() === "") {
      titlewarning.classList.remove("hide");
      submit = false;
    }
    if (body.value.trim() === "") {
      bodywarning.classList.remove("hide");
      submit = false;
    }
    if (submit) {
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "post",
        body: {
          title: title.value,
          body: body.value,
          userId: this.state.selecteduser.id,
        },
      }).catch((err) => {
        document.getElementById("error").classList.remove("hide");
      });
    }
  }
  onChangeUser(event) {
    this.setState({
      selecteduser: this.state.users.filter((user) => {
        console.log(user.id + " " + event.target.value);
        return user.id == event.target.value;
      })[0],
    });
  }
  render() {
    return (
      <div className="form-div">
        <form onSubmit={this.submitForm}>
          <div className="users-div">
            <label className="userlabel">Select a user:</label>
            {this.state.users.map((user, index) => {
              let id = "user" + user.id;
              return (
                <div className="user-div" key={user.id}>
                  <input
                    id={id}
                    type="radio"
                    name="user"
                    value={user.id}
                    onClick={this.onChangeUser}
                  />
                  <label htmlFor={id}>
                    <p>{user.name}</p>
                  </label>
                </div>
              );
            })}
          </div>
          <div className="map-form-div">
            <div id="map">
              <GoogleMapReact
                bootstrapURLKeys={{
                  key: "AIzaSyBkBl35568x4DZLMW9RhcMrTz1E6FHQK18",
                }}
                defaultCenter={{
                  lat: 0,
                  lng: 0,
                }}
                defaultZoom={1}
              >
                {this.state.users.map((user) => {
                  return (
                    <Marker
                      lat={user.address.geo.lat}
                      lng={user.address.geo.lng}
                      text={user.name}
                    />
                  );
                })}
              </GoogleMapReact>
            </div>
            <div className="form">
              <p className="warning hide" id="user-warning">
                Please Select a User!!!
              </p>
              <p className="warning hide" id="title-warning">
                Please Enter a Title!!!
              </p>
              <p className="warning hide" id="body-warning">
                Please Enter a Body!!!
              </p>
              <div className="title-div">
                <label for="title">Enter title here:</label>
                <input type="text" id="title" />
              </div>
              <div className="body-div">
                <label for="body">Enter body here:</label>
                <textarea id="body"></textarea>
              </div>
              <input type="submit" value="Submit" />
            </div>
          </div>
        </form>
        <div
          className="error-div hide id='error"
          onClick={(event) => {
            event.currentTarget.classList.add("hide");
          }}
        >
          <p>
            Error Happened!! kindly{" "}
            <button
              onClick={() => {
                window.location.reload();
              }}
            >
              refresh
            </button>{" "}
            or visit later.
          </p>
        </div>
      </div>
    );
  }
}
